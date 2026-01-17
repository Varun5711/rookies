import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegistryService } from './registry.service';
import { RegisterServiceDto } from './dto/register-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Public, Roles, UserRole } from '@dpi/common';

/**
 * Registry Controller
 * Handles service registration and discovery endpoints
 *
 * All endpoints are public for now (can be secured later)
 * In production, only admins should register/modify services
 */
@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  /**
   * Register a new service
   * POST /api/registry/services
   * REQUIRES: PLATFORM_ADMIN role
   */
  @Roles(UserRole.PLATFORM_ADMIN)
  @Post('services')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterServiceDto) {
    const service = await this.registryService.registerService(dto);

    return {
      success: true,
      message: 'Service registered successfully',
      service: {
        id: service.id,
        name: service.name,
        displayName: service.displayName,
        baseUrl: service.baseUrl,
        status: service.status,
        healthStatus: service.healthStatus,
      },
    };
  }

  /**
   * Get all registered services
   * GET /api/registry/services
   */
  @Public()
  @Get('services')
  async getAll() {
    const services = await this.registryService.getAllServices();

    return {
      success: true,
      count: services.length,
      services,
    };
  }

  /**
   * Get service by name
   * GET /api/registry/services/:name
   */
  @Public()
  @Get('services/:name')
  async getByName(@Param('name') name: string) {
    const service = await this.registryService.getServiceByName(name);

    if (!service) {
      return {
        success: false,
        message: `Service '${name}' not found`,
      };
    }

    return {
      success: true,
      service,
    };
  }

  /**
   * Update service
   * PUT /api/registry/services/:name
   * REQUIRES: PLATFORM_ADMIN role
   */
  @Roles(UserRole.PLATFORM_ADMIN)
  @Put('services/:name')
  async update(@Param('name') name: string, @Body() dto: UpdateServiceDto) {
    const service = await this.registryService.updateService(name, dto);

    return {
      success: true,
      message: 'Service updated successfully',
      service,
    };
  }

  /**
   * Update service status
   * PUT /api/registry/services/:name/status
   * REQUIRES: PLATFORM_ADMIN role
   */
  @Roles(UserRole.PLATFORM_ADMIN)
  @Put('services/:name/status')
  async updateStatus(
    @Param('name') name: string,
    @Body('status') status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  ) {
    const service = await this.registryService.updateService(name, { status });

    return {
      success: true,
      message: `Service status updated to ${status}`,
      service,
    };
  }

  /**
   * Delete (deregister) service
   * DELETE /api/registry/services/:name
   * REQUIRES: PLATFORM_ADMIN role
   */
  @Roles(UserRole.PLATFORM_ADMIN)
  @Delete('services/:name')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('name') name: string) {
    await this.registryService.deleteService(name);

    return {
      success: true,
      message: 'Service deregistered successfully',
    };
  }

  /**
   * Get platform health aggregation
   * GET /api/registry/health
   */
  @Public()
  @Get('health')
  async getPlatformHealth() {
    const health = await this.registryService.getPlatformHealth();

    return {
      success: true,
      platformHealth: health,
    };
  }
}
