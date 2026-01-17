import { Controller, Get, Param, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import {
  DoctorDto,
  PaginatedDoctorsDto,
  AvailableSlotsDto,
} from './dto/doctor.dto';

/**
 * Doctors Controller
 * Handles doctor-related API endpoints
 *
 * Endpoints:
 * - GET /doctors - List all doctors with optional hospital filter
 * - GET /doctors/:id - Get doctor by ID
 * - GET /doctors/:id/slots - Get available time slots for a doctor
 */
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  /**
   * List all doctors with optional hospital filter and pagination
   * @param page - Page number (default: 1)
   * @param pageSize - Items per page (default: 10)
   * @param hospitalId - Optional hospital ID to filter by
   * @returns Paginated list of doctors
   */
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('hospitalId') hospitalId?: string,
  ): Promise<PaginatedDoctorsDto> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;

    return this.doctorsService.findAll(pageNum, pageSizeNum, hospitalId);
  }

  /**
   * Get doctor by ID
   * @param id - Doctor ID
   * @returns Doctor details
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DoctorDto> {
    return this.doctorsService.findOne(id);
  }

  /**
   * Get available time slots for a doctor
   * @param id - Doctor ID
   * @param date - Date in YYYY-MM-DD format
   * @returns Available slots for the doctor on that date
   */
  @Get(':id/slots')
  async getAvailableSlots(
    @Param('id') id: string,
    @Query('date') date: string,
  ): Promise<AvailableSlotsDto> {
    return this.doctorsService.findAvailableSlots(id, date);
  }
}
