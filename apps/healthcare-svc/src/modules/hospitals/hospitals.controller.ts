import { Controller, Get, Param, Query } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { HospitalDto, PaginatedHospitalsDto } from './dto/hospital.dto';

/**
 * Hospitals Controller
 * Handles hospital-related API endpoints
 *
 * Endpoints:
 * - GET /hospitals - List all hospitals with pagination
 * - GET /hospitals/:id - Get hospital by ID
 */
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  /**
   * List all hospitals with pagination
   * @param page - Page number (default: 1)
   * @param pageSize - Items per page (default: 10)
   * @returns Paginated list of hospitals
   */
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedHospitalsDto> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;

    return this.hospitalsService.findAll(pageNum, pageSizeNum);
  }

  /**
   * Get hospital by ID
   * @param id - Hospital ID
   * @returns Hospital details
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HospitalDto> {
    return this.hospitalsService.findOne(id);
  }
}
