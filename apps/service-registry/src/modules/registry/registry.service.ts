import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisteredService } from './entities/registered-service.entity';
import { RegisterServiceDto } from './dto/register-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

/**
 * Registry Service
 * Manages service registration, discovery, and health tracking
 *
 * Key Responsibilities:
 * - Service CRUD operations
 * - Service discovery by name
 * - Health status tracking
 * - Platform health aggregation
 */
@Injectable()
export class RegistryService {
  private readonly logger = new Logger(RegistryService.name);

  constructor(
    @InjectRepository(RegisteredService)
    private readonly serviceRepo: Repository<RegisteredService>,
  ) {}

  /**
   * Register a new service
   */
  async registerService(
    dto: RegisterServiceDto,
    registeredBy?: string
  ): Promise<RegisteredService> {
    // Check if service already exists
    const existing = await this.serviceRepo.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Service with name '${dto.name}' already exists`
      );
    }

    // Create new service
    const service = this.serviceRepo.create({
      ...dto,
      healthEndpoint: dto.healthEndpoint || '/health',
      tags: dto.tags || [],
      isPublic: dto.isPublic ?? false,
      requiredRoles: dto.requiredRoles || [],
      registeredBy,
      status: 'ACTIVE',
      healthStatus: 'HEALTHY',
    });

    const saved = await this.serviceRepo.save(service);
    this.logger.log(`Service registered: ${saved.name} (${saved.id})`);

    return saved;
  }

  /**
   * Get all registered services
   */
  async getAllServices(): Promise<RegisteredService[]> {
    return this.serviceRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get active services only
   */
  async getActiveServices(): Promise<RegisteredService[]> {
    return this.serviceRepo.find({
      where: { status: 'ACTIVE' },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get service by name
   */
  async getServiceByName(name: string): Promise<RegisteredService | null> {
    return this.serviceRepo.findOne({ where: { name } });
  }

  /**
   * Get service by ID
   */
  async getServiceById(id: string): Promise<RegisteredService | null> {
    return this.serviceRepo.findOne({ where: { id } });
  }

  /**
   * Update service
   */
  async updateService(
    name: string,
    dto: UpdateServiceDto
  ): Promise<RegisteredService> {
    const service = await this.getServiceByName(name);

    if (!service) {
      throw new NotFoundException(`Service '${name}' not found`);
    }

    Object.assign(service, dto);
    const updated = await this.serviceRepo.save(service);

    this.logger.log(`Service updated: ${updated.name} (${updated.id})`);
    return updated;
  }

  /**
   * Update service health status
   */
  async updateHealthStatus(
    id: string,
    healthStatus: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED'
  ): Promise<void> {
    await this.serviceRepo.update(id, {
      healthStatus,
      lastHealthCheck: new Date(),
    });

    if (healthStatus === 'UNHEALTHY') {
      const service = await this.getServiceById(id);
      this.logger.warn(`Service unhealthy: ${service?.name} (${id})`);
    }
  }

  /**
   * Delete (deregister) service
   */
  async deleteService(name: string): Promise<void> {
    const service = await this.getServiceByName(name);

    if (!service) {
      throw new NotFoundException(`Service '${name}' not found`);
    }

    await this.serviceRepo.remove(service);
    this.logger.log(`Service deregistered: ${name}`);
  }

  /**
   * Get platform health aggregation
   */
  async getPlatformHealth(): Promise<{
    totalServices: number;
    activeServices: number;
    healthyServices: number;
    unhealthyServices: number;
    degradedServices: number;
    services: {
      name: string;
      status: string;
      healthStatus: string;
      lastHealthCheck?: Date;
    }[];
  }> {
    const allServices = await this.getAllServices();

    const activeServices = allServices.filter((s) => s.status === 'ACTIVE');
    const healthyServices = allServices.filter(
      (s) => s.healthStatus === 'HEALTHY'
    );
    const unhealthyServices = allServices.filter(
      (s) => s.healthStatus === 'UNHEALTHY'
    );
    const degradedServices = allServices.filter(
      (s) => s.healthStatus === 'DEGRADED'
    );

    return {
      totalServices: allServices.length,
      activeServices: activeServices.length,
      healthyServices: healthyServices.length,
      unhealthyServices: unhealthyServices.length,
      degradedServices: degradedServices.length,
      services: allServices.map((s) => ({
        name: s.name,
        status: s.status,
        healthStatus: s.healthStatus,
        lastHealthCheck: s.lastHealthCheck,
      })),
    };
  }
}
