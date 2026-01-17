import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Scheme } from './entities/scheme.entity';
import { Application, ApplicationStatus } from './entities/application.entity';
import { QuerySchemeDto } from './dto/query-scheme.dto';
import { ApplySchemeDto } from './dto/apply-scheme.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { AgricultureEventTopics, SchemeAppliedEvent } from '@dpi/kafka';

@Injectable()
export class SchemesService {
  constructor(
    @InjectRepository(Scheme)
    private readonly schemeRepository: Repository<Scheme>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async findAllSchemes(query: QuerySchemeDto) {
    const { category, search, activeOnly = true, page = 1, limit = 10 } = query;

    const where: FindOptionsWhere<Scheme> = {};

    if (activeOnly) {
      where.isActive = true;
      const now = new Date();
      where.startDate = LessThanOrEqual(now);
      where.endDate = MoreThanOrEqual(now);
    }

    if (category) where.category = category;
    if (search) where.name = Like(`%${search}%`);

    const [schemes, total] = await this.schemeRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data: schemes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneScheme(id: string): Promise<Scheme> {
    const scheme = await this.schemeRepository.findOne({ where: { id } });

    if (!scheme) {
      throw new NotFoundException(`Scheme with ID ${id} not found`);
    }

    return scheme;
  }

  async apply(
    schemeId: string,
    userId: string,
    applyDto: ApplySchemeDto,
  ): Promise<Application> {
    const scheme = await this.findOneScheme(schemeId);

    if (!scheme.isActive) {
      throw new BadRequestException('This scheme is not active');
    }

    // Check if user already applied
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        schemeId,
        userId,
        status: ApplicationStatus.PENDING,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You already have a pending application for this scheme');
    }

    const application = this.applicationRepository.create({
      ...applyDto,
      schemeId,
      userId,
      status: ApplicationStatus.PENDING,
    });

    const savedApplication = await this.applicationRepository.save(application);

    // Emit Kafka event
    const event: SchemeAppliedEvent = {
      applicationId: savedApplication.id,
      userId,
      schemeId,
      schemeName: scheme.name,
      status: savedApplication.status,
      timestamp: new Date().toISOString(),
    };

    this.kafkaClient.emit(AgricultureEventTopics.SCHEME_APPLIED, event);

    return savedApplication;
  }

  async findUserApplications(userId: string, query: QueryApplicationDto) {
    const { schemeId, status, page = 1, limit = 10 } = query;

    const where: FindOptionsWhere<Application> = { userId };

    if (schemeId) where.schemeId = schemeId;
    if (status) where.status = status;

    const [applications, total] = await this.applicationRepository.findAndCount({
      where,
      relations: ['scheme'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: applications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findApplicationById(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['scheme'],
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  async getApplicationStatus(id: string, userId: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id, userId },
      relations: ['scheme'],
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }
}
