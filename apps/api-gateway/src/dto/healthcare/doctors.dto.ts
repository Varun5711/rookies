import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
    @ApiProperty({
        description: 'Doctor name',
        example: 'Dr. Ramesh Kumar',
        minLength: 2,
        maxLength: 200,
    })
    name: string;

    @ApiProperty({
        description: 'Medical specialization',
        example: 'Cardiology',
    })
    specialization: string;

    @ApiPropertyOptional({
        description: 'Qualification details',
        example: 'MBBS, MD (Cardiology), FACC',
    })
    qualification?: string;

    @ApiPropertyOptional({
        description: 'Years of experience',
        example: 15,
        minimum: 0,
    })
    experience?: number;

    @ApiPropertyOptional({
        description: 'Contact phone number',
        example: '+919876543210',
    })
    contactNumber?: string;

    @ApiPropertyOptional({
        description: 'Contact email address',
        example: 'dr.ramesh@hospital.com',
    })
    email?: string;

    @ApiProperty({
        description: 'Hospital ID where doctor works',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    hospitalId: string;

    @ApiPropertyOptional({
        description: 'Consultation fee in INR',
        example: 500,
        minimum: 0,
    })
    consultationFee?: number;

    @ApiPropertyOptional({
        description: 'Available days for consultation',
        example: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        type: [String],
    })
    availableDays?: string[];

    @ApiPropertyOptional({
        description: 'Whether doctor is accepting new patients',
        example: true,
        default: true,
    })
    isActive?: boolean;
}

export class QueryDoctorDto {
    @ApiPropertyOptional({ description: 'Filter by specialization', example: 'Cardiology' })
    specialization?: string;

    @ApiPropertyOptional({ description: 'Filter by hospital ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    hospitalId?: string;

    @ApiPropertyOptional({ description: 'Filter by city (via hospital)', example: 'Mumbai' })
    city?: string;

    @ApiPropertyOptional({ description: 'Search in name and specialization', example: 'Ramesh' })
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by availability', example: true })
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1, minimum: 1 })
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10, minimum: 1, maximum: 100 })
    limit?: number;
}

export class CreateTimeSlotDto {
    @ApiProperty({
        description: 'Doctor ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    doctorId: string;

    @ApiProperty({
        description: 'Day of week',
        example: 'Monday',
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    })
    dayOfWeek: string;

    @ApiProperty({
        description: 'Start time (HH:MM format)',
        example: '09:00',
    })
    startTime: string;

    @ApiProperty({
        description: 'End time (HH:MM format)',
        example: '17:00',
    })
    endTime: string;

    @ApiPropertyOptional({
        description: 'Maximum appointments per slot',
        example: 20,
        default: 10,
    })
    maxAppointments?: number;
}

export class DoctorResponse {
    @ApiProperty({ description: 'Doctor ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'Doctor name', example: 'Dr. Ramesh Kumar' })
    name: string;

    @ApiProperty({ description: 'Specialization', example: 'Cardiology' })
    specialization: string;

    @ApiPropertyOptional({ description: 'Qualification' })
    qualification?: string;

    @ApiPropertyOptional({ description: 'Experience in years' })
    experience?: number;

    @ApiPropertyOptional({ description: 'Contact number' })
    contactNumber?: string;

    @ApiPropertyOptional({ description: 'Email address' })
    email?: string;

    @ApiProperty({ description: 'Hospital ID' })
    hospitalId: string;

    @ApiPropertyOptional({ description: 'Consultation fee in INR' })
    consultationFee?: number;

    @ApiProperty({ description: 'Whether doctor is active', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;
}

export class TimeSlotResponse {
    @ApiProperty({ description: 'Slot ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'Doctor ID' })
    doctorId: string;

    @ApiProperty({ description: 'Day of week', example: 'Monday' })
    dayOfWeek: string;

    @ApiProperty({ description: 'Start time', example: '09:00' })
    startTime: string;

    @ApiProperty({ description: 'End time', example: '17:00' })
    endTime: string;

    @ApiProperty({ description: 'Maximum appointments', example: 20 })
    maxAppointments: number;

    @ApiProperty({ description: 'Whether slot is active', example: true })
    isActive: boolean;
}
