import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { TimeSlot } from './entities/time-slot.entity';
import {
  DoctorDto,
  PaginatedDoctorsDto,
  AvailableSlotsDto,
  TimeSlotDto,
} from './dto/doctor.dto';

/**
 * Doctors Service
 * Handles doctor-related business logic
 *
 * Features:
 * - Find all doctors with optional hospital filter
 * - Find doctor by ID
 * - Find available time slots for a doctor
 */
@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepository: Repository<TimeSlot>,
  ) {}

  /**
   * Find all doctors with optional hospital filter and pagination
   * @param page - Page number (1-based)
   * @param pageSize - Number of items per page
   * @param hospitalId - Optional hospital ID to filter by
   * @returns Paginated list of doctors
   */
  async findAll(
    page: number = 1,
    pageSize: number = 10,
    hospitalId?: string,
  ): Promise<PaginatedDoctorsDto> {
    const skip = (page - 1) * pageSize;
    const query = this.doctorRepository.createQueryBuilder('doctor');

    if (hospitalId) {
      query.where('doctor.hospitalId = :hospitalId', { hospitalId });
    }

    query.andWhere('doctor.isAvailable = :isAvailable', { isAvailable: true });
    query.skip(skip).take(pageSize).orderBy('doctor.name', 'ASC');

    const [doctors, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: doctors.map((doctor) => DoctorDto.fromEntity(doctor)),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Find doctor by ID
   * @param id - Doctor ID
   * @returns Doctor data if found
   * @throws NotFoundException if doctor not found
   */
  async findOne(id: string): Promise<DoctorDto> {
    const doctor = await this.doctorRepository.findOne({
      where: { id, isAvailable: true },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return DoctorDto.fromEntity(doctor);
  }

  /**
   * Find available time slots for a doctor on a specific date
   * @param doctorId - Doctor ID
   * @param date - Date to find slots for (YYYY-MM-DD format)
   * @returns Available slots for the doctor on that date
   * @throws NotFoundException if doctor not found
   */
  async findAvailableSlots(
    doctorId: string,
    date: string,
  ): Promise<AvailableSlotsDto> {
    // Verify doctor exists
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId, isAvailable: true },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    // Find available slots for the date
    const slots = await this.timeSlotRepository.find({
      where: {
        doctorId,
        date: new Date(date),
        isAvailable: true,
      },
      order: { startTime: 'ASC' },
    });

    return {
      doctorId,
      doctorName: doctor.name,
      date: new Date(date),
      slots: slots.map((slot) => this.timeSlotToDto(slot)),
    };
  }

  /**
   * Convert TimeSlot entity to DTO
   */
  private timeSlotToDto(timeSlot: TimeSlot): TimeSlotDto {
    return {
      id: timeSlot.id,
      doctorId: timeSlot.doctorId,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      date: timeSlot.date,
      isAvailable: timeSlot.isAvailable,
      createdAt: timeSlot.createdAt,
      updatedAt: timeSlot.updatedAt,
    };
  }
}
