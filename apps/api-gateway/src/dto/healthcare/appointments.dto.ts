import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
}

export class CreateAppointmentDto {
    @ApiProperty({
        description: 'Doctor ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    doctorId: string;

    @ApiProperty({
        description: 'Time slot ID',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    slotId: string;

    @ApiProperty({
        description: 'Appointment date (YYYY-MM-DD)',
        example: '2026-01-20',
    })
    date: string;

    @ApiPropertyOptional({
        description: 'Reason for appointment',
        example: 'Annual heart checkup',
    })
    reason?: string;

    @ApiPropertyOptional({
        description: 'Additional notes for the doctor',
        example: 'History of high blood pressure',
    })
    notes?: string;
}

export class QueryAppointmentDto {
    @ApiPropertyOptional({ description: 'Filter by doctor ID' })
    doctorId?: string;

    @ApiPropertyOptional({ description: 'Filter by status', enum: AppointmentStatus })
    status?: AppointmentStatus;

    @ApiPropertyOptional({ description: 'Filter by start date (YYYY-MM-DD)', example: '2026-01-01' })
    fromDate?: string;

    @ApiPropertyOptional({ description: 'Filter by end date (YYYY-MM-DD)', example: '2026-01-31' })
    toDate?: string;

    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1, minimum: 1 })
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10, minimum: 1, maximum: 100 })
    limit?: number;
}

export class CancelAppointmentDto {
    @ApiProperty({
        description: 'Reason for cancellation',
        example: 'Unable to attend due to personal reasons',
    })
    reason: string;
}

export class AppointmentResponse {
    @ApiProperty({ description: 'Appointment ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'User ID of the patient' })
    userId: string;

    @ApiProperty({ description: 'Doctor ID' })
    doctorId: string;

    @ApiProperty({ description: 'Time slot ID' })
    slotId: string;

    @ApiProperty({ description: 'Appointment date', example: '2026-01-20' })
    date: string;

    @ApiProperty({ description: 'Appointment status', enum: AppointmentStatus })
    status: AppointmentStatus;

    @ApiPropertyOptional({ description: 'Reason for appointment' })
    reason?: string;

    @ApiPropertyOptional({ description: 'Additional notes' })
    notes?: string;

    @ApiPropertyOptional({ description: 'Cancellation reason (if cancelled)' })
    cancellationReason?: string;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;
}
