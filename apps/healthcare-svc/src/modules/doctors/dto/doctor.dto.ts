import { Doctor } from '../entities/doctor.entity';

/**
 * Doctor Response DTO
 * Used for API responses to format doctor data
 */
export class DoctorDto {
  id: string;
  name: string;
  specialization: string;
  hospitalId: string;
  qualification: string;
  experience: number;
  isAvailable: boolean;
  consultationFee: number;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Convert Doctor entity to DTO
   */
  static fromEntity(doctor: Doctor): DoctorDto {
    const dto = new DoctorDto();
    dto.id = doctor.id;
    dto.name = doctor.name;
    dto.specialization = doctor.specialization;
    dto.hospitalId = doctor.hospitalId;
    dto.qualification = doctor.qualification;
    dto.experience = doctor.experience;
    dto.isAvailable = doctor.isAvailable;
    dto.consultationFee = doctor.consultationFee;
    dto.createdAt = doctor.createdAt;
    dto.updatedAt = doctor.updatedAt;
    return dto;
  }
}

/**
 * Paginated Doctor Response
 */
export class PaginatedDoctorsDto {
  data: DoctorDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Time Slot DTO
 */
export class TimeSlotDto {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  date: Date;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Available Slots Response
 */
export class AvailableSlotsDto {
  doctorId: string;
  doctorName: string;
  date: Date;
  slots: TimeSlotDto[];
}
