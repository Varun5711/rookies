import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { Public } from '@dpi/common';
import {
    CreateHospitalDto,
    QueryHospitalDto,
    HospitalResponse,
} from '../../dto/healthcare/hospitals.dto';
import {
    CreateDoctorDto,
    QueryDoctorDto,
    CreateTimeSlotDto,
    DoctorResponse,
    TimeSlotResponse,
} from '../../dto/healthcare/doctors.dto';
import {
    CreateAppointmentDto,
    QueryAppointmentDto,
    CancelAppointmentDto,
    AppointmentResponse,
} from '../../dto/healthcare/appointments.dto';

/**
 * Healthcare Gateway Controller
 * Documents healthcare service endpoints for Swagger UI.
 * NOTE: These endpoints are proxied to healthcare-svc - no implementation here.
 */
@ApiTags('Healthcare Services')
@Controller('services/healthcare')
export class HealthcareGatewayController {
    // ==================== HOSPITALS ====================

    @ApiOperation({
        summary: 'Get all hospitals',
        description: 'Retrieve a paginated list of hospitals with optional filtering by city, state, type, etc.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of hospitals retrieved successfully',
        type: [HospitalResponse],
    })
    @Public()
    @Get('hospitals')
    getHospitals(@Query() _query: QueryHospitalDto) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Get hospital by ID',
        description: 'Retrieve detailed information about a specific hospital.',
    })
    @ApiParam({ name: 'id', description: 'Hospital UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
    @ApiResponse({
        status: 200,
        description: 'Hospital details retrieved successfully',
        type: HospitalResponse,
    })
    @ApiResponse({ status: 404, description: 'Hospital not found' })
    @Public()
    @Get('hospitals/:id')
    getHospital(@Param('id') _id: string) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Create a new hospital',
        description: 'Register a new hospital in the system. **Requires PLATFORM_ADMIN role.**',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiBody({ type: CreateHospitalDto })
    @ApiResponse({
        status: 201,
        description: 'Hospital created successfully',
        type: HospitalResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Requires PLATFORM_ADMIN role' })
    @Post('hospitals')
    createHospital(@Body() _dto: CreateHospitalDto) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Update hospital details',
        description: 'Update an existing hospital. **Requires PLATFORM_ADMIN role.**',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Hospital UUID' })
    @ApiBody({ type: CreateHospitalDto })
    @ApiResponse({
        status: 200,
        description: 'Hospital updated successfully',
        type: HospitalResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Requires PLATFORM_ADMIN role' })
    @ApiResponse({ status: 404, description: 'Hospital not found' })
    @Put('hospitals/:id')
    updateHospital(@Param('id') _id: string, @Body() _dto: Partial<CreateHospitalDto>) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Delete a hospital',
        description: 'Remove a hospital from the system. **Requires PLATFORM_ADMIN role.**',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Hospital UUID' })
    @ApiResponse({ status: 200, description: 'Hospital deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Requires PLATFORM_ADMIN role' })
    @ApiResponse({ status: 404, description: 'Hospital not found' })
    @Delete('hospitals/:id')
    deleteHospital(@Param('id') _id: string) {
        // Proxied to healthcare-svc
    }

    // ==================== DOCTORS ====================

    @ApiOperation({
        summary: 'Get all doctors',
        description: 'Retrieve a paginated list of doctors with optional filtering by specialization, hospital, etc.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of doctors retrieved successfully',
        type: [DoctorResponse],
    })
    @Public()
    @Get('doctors')
    getDoctors(@Query() _query: QueryDoctorDto) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Get doctor by ID',
        description: 'Retrieve detailed information about a specific doctor.',
    })
    @ApiParam({ name: 'id', description: 'Doctor UUID' })
    @ApiResponse({
        status: 200,
        description: 'Doctor details retrieved successfully',
        type: DoctorResponse,
    })
    @ApiResponse({ status: 404, description: 'Doctor not found' })
    @Public()
    @Get('doctors/:id')
    getDoctor(@Param('id') _id: string) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Create a new doctor',
        description: 'Register a new doctor. **Requires SERVICE_PROVIDER or PLATFORM_ADMIN role.**',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiBody({ type: CreateDoctorDto })
    @ApiResponse({
        status: 201,
        description: 'Doctor created successfully',
        type: DoctorResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
    @Post('doctors')
    createDoctor(@Body() _dto: CreateDoctorDto) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Update doctor details',
        description: 'Update an existing doctor. **Requires SERVICE_PROVIDER or PLATFORM_ADMIN role.**',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Doctor UUID' })
    @ApiBody({ type: CreateDoctorDto })
    @ApiResponse({
        status: 200,
        description: 'Doctor updated successfully',
        type: DoctorResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
    @ApiResponse({ status: 404, description: 'Doctor not found' })
    @Put('doctors/:id')
    updateDoctor(@Param('id') _id: string, @Body() _dto: Partial<CreateDoctorDto>) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Delete a doctor',
        description: 'Remove a doctor from the system. **Requires PLATFORM_ADMIN role.**',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Doctor UUID' })
    @ApiResponse({ status: 200, description: 'Doctor deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Requires PLATFORM_ADMIN role' })
    @ApiResponse({ status: 404, description: 'Doctor not found' })
    @Delete('doctors/:id')
    deleteDoctor(@Param('id') _id: string) {
        // Proxied to healthcare-svc
    }

    // ==================== DOCTOR TIME SLOTS ====================

    @ApiOperation({
        summary: 'Get doctor time slots',
        description: 'Get available time slots for a specific doctor.',
    })
    @ApiParam({ name: 'id', description: 'Doctor UUID' })
    @ApiResponse({
        status: 200,
        description: 'Time slots retrieved successfully',
        type: [TimeSlotResponse],
    })
    @ApiResponse({ status: 404, description: 'Doctor not found' })
    @Public()
    @Get('doctors/:id/slots')
    getDoctorSlots(@Param('id') _id: string) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Create doctor time slot',
        description: 'Add a new time slot for a doctor. **Requires SERVICE_PROVIDER or PLATFORM_ADMIN role.**',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Doctor UUID' })
    @ApiBody({ type: CreateTimeSlotDto })
    @ApiResponse({
        status: 201,
        description: 'Time slot created successfully',
        type: TimeSlotResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
    @Post('doctors/:id/slots')
    createDoctorSlot(@Param('id') _id: string, @Body() _dto: Omit<CreateTimeSlotDto, 'doctorId'>) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Update time slot',
        description: 'Update an existing time slot. **Requires SERVICE_PROVIDER or PLATFORM_ADMIN role.**',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'slotId', description: 'Slot UUID' })
    @ApiBody({ type: CreateTimeSlotDto })
    @ApiResponse({
        status: 200,
        description: 'Time slot updated successfully',
        type: TimeSlotResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
    @ApiResponse({ status: 404, description: 'Time slot not found' })
    @Put('doctors/slots/:slotId')
    updateSlot(@Param('slotId') _slotId: string, @Body() _dto: Partial<CreateTimeSlotDto>) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Delete time slot',
        description: 'Remove a time slot. **Requires PLATFORM_ADMIN role.**',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'slotId', description: 'Slot UUID' })
    @ApiResponse({ status: 200, description: 'Time slot deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Requires PLATFORM_ADMIN role' })
    @ApiResponse({ status: 404, description: 'Time slot not found' })
    @Delete('doctors/slots/:slotId')
    deleteSlot(@Param('slotId') _slotId: string) {
        // Proxied to healthcare-svc
    }

    // ==================== APPOINTMENTS ====================

    @ApiOperation({
        summary: 'Get all appointments',
        description: 'Retrieve a paginated list of appointments with optional filtering. **Requires authentication.**',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({
        status: 200,
        description: 'List of appointments retrieved successfully',
        type: [AppointmentResponse],
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get('appointments')
    getAppointments(@Query() _query: QueryAppointmentDto) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Get my appointments',
        description: 'Get appointments for the currently authenticated user.',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({
        status: 200,
        description: 'User appointments retrieved successfully',
        type: [AppointmentResponse],
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get('appointments/me')
    getMyAppointments(@Query() _query: QueryAppointmentDto) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Get appointment by ID',
        description: 'Retrieve detailed information about a specific appointment.',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Appointment UUID' })
    @ApiResponse({
        status: 200,
        description: 'Appointment details retrieved successfully',
        type: AppointmentResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Appointment not found' })
    @Get('appointments/:id')
    getAppointment(@Param('id') _id: string) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Book an appointment',
        description: `
Book a new appointment with a doctor.

**Note:** This endpoint is for citizen users only. Admin users cannot book appointments on behalf of users.
    `,
    })
    @ApiBearerAuth('JWT-auth')
    @ApiBody({ type: CreateAppointmentDto })
    @ApiResponse({
        status: 201,
        description: 'Appointment booked successfully',
        type: AppointmentResponse,
    })
    @ApiResponse({ status: 400, description: 'Invalid request or slot not available' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin users cannot book appointments' })
    @Post('appointments')
    createAppointment(@Body() _dto: CreateAppointmentDto) {
        // Proxied to healthcare-svc
    }

    @ApiOperation({
        summary: 'Cancel an appointment',
        description: 'Cancel an existing appointment. User can only cancel their own appointments.',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Appointment UUID' })
    @ApiBody({ type: CancelAppointmentDto })
    @ApiResponse({
        status: 200,
        description: 'Appointment cancelled successfully',
        type: AppointmentResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Cannot cancel appointment owned by another user' })
    @ApiResponse({ status: 404, description: 'Appointment not found' })
    @Put('appointments/:id/cancel')
    cancelAppointment(@Param('id') _id: string, @Body() _dto: CancelAppointmentDto) {
        // Proxied to healthcare-svc
    }
}
