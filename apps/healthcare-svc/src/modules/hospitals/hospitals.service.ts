import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from './entities/hospital.entity';
import { HospitalDto, PaginatedHospitalsDto } from './dto/hospital.dto';

/**
 * Hospitals Service
 * Handles hospital-related business logic
 *
 * Features:
 * - Find all hospitals with pagination
 * - Find hospital by ID
 */
@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
  ) {}

  /**
   * Find all hospitals with pagination
   * @param page - Page number (1-based)
   * @param pageSize - Number of items per page
   * @returns Paginated list of hospitals
   */
  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedHospitalsDto> {
    const skip = (page - 1) * pageSize;

    const [hospitals, total] = await this.hospitalRepository.findAndCount({
      where: { isActive: true },
      skip,
      take: pageSize,
      order: { name: 'ASC' },
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: hospitals.map((hospital) => HospitalDto.fromEntity(hospital)),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Find hospital by ID
   * @param id - Hospital ID
   * @returns Hospital data if found
   * @throws NotFoundException if hospital not found
   */
  async findOne(id: string): Promise<HospitalDto> {
    const hospital = await this.hospitalRepository.findOne({
      where: { id, isActive: true },
    });

    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    return HospitalDto.fromEntity(hospital);
  }
}
