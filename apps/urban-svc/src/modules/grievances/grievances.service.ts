import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Grievance, GrievanceStatus, GrievancePriority } from './entities/grievance.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateGrievanceDto } from './dto/create-grievance.dto';
import { QueryGrievanceDto } from './dto/query-grievance.dto';
import { EscalateGrievanceDto } from './dto/escalate-grievance.dto';
import {
  UrbanEventTopics,
  GrievanceSubmittedEvent,
  GrievanceEscalatedEvent,
} from '@dpi/kafka';

@Injectable()
export class GrievancesService {
  constructor(
    @InjectRepository(Grievance)
    private readonly grievanceRepository: Repository<Grievance>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async create(userId: string, createDto: CreateGrievanceDto): Promise<Grievance> {
    const category = await this.categoryRepository.findOne({
      where: { id: createDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${createDto.categoryId} not found`);
    }

    // Calculate due date based on SLA
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + category.slaDays);

    const grievance = this.grievanceRepository.create({
      ...createDto,
      userId,
      status: GrievanceStatus.SUBMITTED,
      assignedDepartment: category.department,
      dueDate,
    });

    const savedGrievance = await this.grievanceRepository.save(grievance);

    // Emit Kafka event
    const event: GrievanceSubmittedEvent = {
      grievanceId: savedGrievance.id,
      userId,
      category: category.name,
      title: savedGrievance.title,
      description: savedGrievance.description,
      location: savedGrievance.location,
      priority: savedGrievance.priority,
      timestamp: new Date().toISOString(),
    };

    this.kafkaClient.emit(UrbanEventTopics.GRIEVANCE_SUBMITTED, event);

    return savedGrievance;
  }

  async findAll(query: QueryGrievanceDto) {
    const { categoryId, status, priority, ward, search, page = 1, limit = 10 } = query;

    const where: FindOptionsWhere<Grievance> = {};

    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (ward) where.ward = ward;
    if (search) where.title = Like(`%${search}%`);

    const [grievances, total] = await this.grievanceRepository.findAndCount({
      where,
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: grievances,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Grievance> {
    const grievance = await this.grievanceRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!grievance) {
      throw new NotFoundException(`Grievance with ID ${id} not found`);
    }

    return grievance;
  }

  async findByUser(userId: string, query: QueryGrievanceDto) {
    const { status, page = 1, limit = 10 } = query;

    const where: FindOptionsWhere<Grievance> = { userId };

    if (status) where.status = status;

    const [grievances, total] = await this.grievanceRepository.findAndCount({
      where,
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: grievances,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async escalate(
    id: string,
    userId: string,
    escalateDto: EscalateGrievanceDto,
  ): Promise<Grievance> {
    const grievance = await this.findOne(id);

    if (grievance.userId !== userId) {
      throw new BadRequestException('You can only escalate your own grievances');
    }

    if (grievance.status === GrievanceStatus.RESOLVED || grievance.status === GrievanceStatus.CLOSED) {
      throw new BadRequestException('Cannot escalate a resolved or closed grievance');
    }

    const previousPriority = grievance.priority;
    grievance.status = GrievanceStatus.ESCALATED;
    grievance.escalationReason = escalateDto.reason;
    grievance.escalatedAt = new Date();

    if (escalateDto.newPriority) {
      grievance.priority = escalateDto.newPriority;
    } else if (grievance.priority !== GrievancePriority.URGENT) {
      // Auto-escalate priority
      const priorities = [GrievancePriority.LOW, GrievancePriority.MEDIUM, GrievancePriority.HIGH, GrievancePriority.URGENT];
      const currentIndex = priorities.indexOf(grievance.priority);
      grievance.priority = priorities[Math.min(currentIndex + 1, priorities.length - 1)];
    }

    const savedGrievance = await this.grievanceRepository.save(grievance);

    // Emit Kafka event
    const event: GrievanceEscalatedEvent = {
      grievanceId: savedGrievance.id,
      userId,
      escalatedBy: userId,
      escalationReason: escalateDto.reason,
      newPriority: savedGrievance.priority,
      timestamp: new Date().toISOString(),
    };

    this.kafkaClient.emit(UrbanEventTopics.GRIEVANCE_ESCALATED, event);

    return savedGrievance;
  }

  async getStatus(id: string, userId: string): Promise<Grievance> {
    const grievance = await this.grievanceRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!grievance) {
      throw new NotFoundException(`Grievance with ID ${id} not found`);
    }

    return grievance;
  }
}
