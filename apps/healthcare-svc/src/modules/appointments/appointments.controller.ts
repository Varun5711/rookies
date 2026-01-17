import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrentUser } from '@dpi/common';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  AppointmentDto,
  PaginatedAppointmentsDto,
} from './dto/appointment.dto';

/**
 * Appointments Controller
 * Handles appointment booking and management endpoints
 *
 * Endpoints:
 * - POST /appointments - Book new appointment
 * - GET /me/appointments - Get user's appointments
 * - PUT /appointments/:id/cancel - Cancel appointment
 */
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * Book a new appointment
   * @param currentUser - Current user from JWT token
   * @param createAppointmentDto - Appointment details
   * @returns Created appointment
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() currentUser: any,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentDto> {
    return this.appointmentsService.create(currentUser.sub, createAppointmentDto);
  }

  /**
   * Get all appointments for the current user
   * @param currentUser - Current user from JWT token
   * @param page - Page number (default: 1)
   * @param pageSize - Items per page (default: 10)
   * @returns Paginated list of user's appointments
   */
  @Get('me/appointments')
  async getMyAppointments(
    @CurrentUser() currentUser: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedAppointmentsDto> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;

    return this.appointmentsService.findByUserId(
      currentUser.sub,
      pageNum,
      pageSizeNum,
    );
  }

  /**
   * Cancel an appointment
   * @param currentUser - Current user from JWT token
   * @param appointmentId - Appointment ID to cancel
   * @returns Cancelled appointment
   */
  @Put(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelAppointment(
    @CurrentUser() currentUser: any,
    @Param('id') appointmentId: string,
  ): Promise<AppointmentDto> {
    return this.appointmentsService.cancel(appointmentId, currentUser.sub);
  }
}
