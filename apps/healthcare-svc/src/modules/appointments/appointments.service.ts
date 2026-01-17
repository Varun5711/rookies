import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { QueryAppointmentDto } from './dto/query-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import {
  HealthcareEventTopics,
  AppointmentBookedEvent,
  AppointmentCancelledEvent,
} from '@dpi/kafka';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async create(userId: string, createDto: CreateAppointmentDto): Promise<Appointment> {
    // Check if there's already an appointment at this time
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId: createDto.doctorId,
        appointmentDate: new Date(createDto.appointmentDate),
        appointmentTime: createDto.appointmentTime,
        status: AppointmentStatus.CONFIRMED,
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('This time slot is already booked');
    }

    const appointment = this.appointmentRepository.create({
      ...createDto,
      userId,
      appointmentDate: new Date(createDto.appointmentDate),
      status: AppointmentStatus.CONFIRMED,
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    // Emit Kafka event
    const event: AppointmentBookedEvent = {
      appointmentId: savedAppointment.id,
      userId,
      hospitalId: savedAppointment.hospitalId,
      doctorId: savedAppointment.doctorId,
      appointmentDate: savedAppointment.appointmentDate.toISOString().split('T')[0],
      appointmentTime: savedAppointment.appointmentTime,
      status: savedAppointment.status,
      timestamp: new Date().toISOString(),
    };

    this.kafkaClient.emit(HealthcareEventTopics.APPOINTMENT_BOOKED, event);

    return savedAppointment;
  }

  async findAll(query: QueryAppointmentDto) {
    const { doctorId, hospitalId, status, fromDate, toDate, page = 1, limit = 10 } = query;

    const where: FindOptionsWhere<Appointment> = {};

    if (doctorId) where.doctorId = doctorId;
    if (hospitalId) where.hospitalId = hospitalId;
    if (status) where.status = status;

    if (fromDate && toDate) {
      where.appointmentDate = Between(new Date(fromDate), new Date(toDate));
    } else if (fromDate) {
      where.appointmentDate = MoreThanOrEqual(new Date(fromDate));
    } else if (toDate) {
      where.appointmentDate = LessThanOrEqual(new Date(toDate));
    }

    const [appointments, total] = await this.appointmentRepository.findAndCount({
      where,
      relations: ['doctor', 'hospital'],
      skip: (page - 1) * limit,
      take: limit,
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });

    return {
      data: appointments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['doctor', 'hospital'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async findByUser(userId: string, query: QueryAppointmentDto) {
    const { status, fromDate, toDate, page = 1, limit = 10 } = query;

    const where: FindOptionsWhere<Appointment> = { userId };

    if (status) where.status = status;

    if (fromDate && toDate) {
      where.appointmentDate = Between(new Date(fromDate), new Date(toDate));
    } else if (fromDate) {
      where.appointmentDate = MoreThanOrEqual(new Date(fromDate));
    } else if (toDate) {
      where.appointmentDate = LessThanOrEqual(new Date(toDate));
    }

    const [appointments, total] = await this.appointmentRepository.findAndCount({
      where,
      relations: ['doctor', 'hospital'],
      skip: (page - 1) * limit,
      take: limit,
      order: { appointmentDate: 'DESC', appointmentTime: 'DESC' },
    });

    return {
      data: appointments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async cancel(
    id: string,
    userId: string,
    cancelDto: CancelAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (appointment.userId !== userId) {
      throw new BadRequestException('You can only cancel your own appointments');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancellationReason = cancelDto.reason;
    appointment.cancelledAt = new Date();

    const savedAppointment = await this.appointmentRepository.save(appointment);

    // Emit Kafka event
    const event: AppointmentCancelledEvent = {
      appointmentId: savedAppointment.id,
      userId,
      hospitalId: savedAppointment.hospitalId,
      doctorId: savedAppointment.doctorId,
      cancellationReason: cancelDto.reason,
      timestamp: new Date().toISOString(),
    };

    this.kafkaClient.emit(HealthcareEventTopics.APPOINTMENT_CANCELLED, event);

    return savedAppointment;
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = status;
    return this.appointmentRepository.save(appointment);
  }
}
