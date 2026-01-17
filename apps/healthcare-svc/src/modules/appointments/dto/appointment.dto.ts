import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';

/**
 * Create Appointment Request DTO
 */
export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  hospitalId: string;

  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsOptional()
  patientAge?: number;

  @IsString()
  @IsNotEmpty()
  patientMobile: string;

  @IsOptional()
  @IsString()
  symptoms?: string;
}

/**
 * Appointment Response DTO
 */
export class AppointmentDto {
  id: string;
  userId: string;
  doctorId: string;
  hospitalId: string;
  appointmentDate: Date;
  status: AppointmentStatus;
  symptoms: string;
  patientName: string;
  patientAge: number;
  patientMobile: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Convert Appointment entity to DTO
   */
  static fromEntity(appointment: Appointment): AppointmentDto {
    const dto = new AppointmentDto();
    dto.id = appointment.id;
    dto.userId = appointment.userId;
    dto.doctorId = appointment.doctorId;
    dto.hospitalId = appointment.hospitalId;
    dto.appointmentDate = appointment.appointmentDate;
    dto.status = appointment.status;
    dto.symptoms = appointment.symptoms;
    dto.patientName = appointment.patientName;
    dto.patientAge = appointment.patientAge;
    dto.patientMobile = appointment.patientMobile;
    dto.createdAt = appointment.createdAt;
    dto.updatedAt = appointment.updatedAt;
    return dto;
  }
}

/**
 * Paginated Appointments Response
 */
export class PaginatedAppointmentsDto {
  data: AppointmentDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
