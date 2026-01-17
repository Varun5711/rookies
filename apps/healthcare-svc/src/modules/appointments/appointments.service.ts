import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaService } from '@dpi/kafka';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import {
  CreateAppointmentDto,
  AppointmentDto,
  PaginatedAppointmentsDto,
} from './dto/appointment.dto';

/**
 * Appointments Service
 * Handles appointment booking and management
 *
 * Features:
 * - Book new appointments
 * - Get user's appointments
 * - Cancel appointments
 * - Emit Kafka events for appointment state changes
 */
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly kafkaService: KafkaService,
  ) {}

  /**
   * Create a new appointment
   * Emits 'dpi.healthcare.appointment-booked' event to Kafka
   * @param userId - User ID booking the appointment
   * @param createAppointmentDto - Appointment details
   * @returns Created appointment
   */
  async create(
    userId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentDto> {
    // Create appointment entity
    const appointment = this.appointmentRepository.create({
      userId,
      ...createAppointmentDto,
      status: AppointmentStatus.PENDING,
    });

    // Save to database
    const savedAppointment = await this.appointmentRepository.save(
      appointment,
    );

    // Emit Kafka event
    await this.kafkaService.emit('dpi.healthcare.appointment-booked', {
      appointmentId: savedAppointment.id,
      userId: savedAppointment.userId,
      doctorId: savedAppointment.doctorId,
      hospitalId: savedAppointment.hospitalId,
      appointmentDate: savedAppointment.appointmentDate,
      patientName: savedAppointment.patientName,
      patientMobile: savedAppointment.patientMobile,
      status: savedAppointment.status,
      timestamp: new Date(),
    });

    return AppointmentDto.fromEntity(savedAppointment);
  }

  /**
   * Get all appointments for a specific user with pagination
   * @param userId - User ID
   * @param page - Page number (1-based)
   * @param pageSize - Number of items per page
   * @returns Paginated list of user's appointments
   */
  async findByUserId(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedAppointmentsDto> {
    const skip = (page - 1) * pageSize;

    const [appointments, total] = await this.appointmentRepository.findAndCount(
      {
        where: { userId },
        skip,
        take: pageSize,
        order: { appointmentDate: 'DESC' },
      },
    );

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: appointments.map((appointment) =>
        AppointmentDto.fromEntity(appointment),
      ),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Cancel an appointment
   * Only the user who booked the appointment can cancel it
   * @param appointmentId - Appointment ID
   * @param userId - User ID requesting cancellation
   * @returns Cancelled appointment
   * @throws NotFoundException if appointment not found
   * @throws ForbiddenException if user is not the owner
   */
  async cancel(appointmentId: string, userId: string): Promise<AppointmentDto> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }

    // Check if user owns this appointment
    if (appointment.userId !== userId) {
      throw new ForbiddenException(
        'You can only cancel your own appointments',
      );
    }

    // Check if appointment can be cancelled (not already completed or cancelled)
    if (
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.status === AppointmentStatus.CANCELLED
    ) {
      throw new ForbiddenException(
        `Cannot cancel appointment with status ${appointment.status}`,
      );
    }

    // Update status
    appointment.status = AppointmentStatus.CANCELLED;
    const updatedAppointment = await this.appointmentRepository.save(
      appointment,
    );

    // Emit Kafka event for cancellation
    await this.kafkaService.emit('dpi.healthcare.appointment-cancelled', {
      appointmentId: updatedAppointment.id,
      userId: updatedAppointment.userId,
      doctorId: updatedAppointment.doctorId,
      hospitalId: updatedAppointment.hospitalId,
      patientName: updatedAppointment.patientName,
      status: updatedAppointment.status,
      timestamp: new Date(),
    });

    return AppointmentDto.fromEntity(updatedAppointment);
  }
}
