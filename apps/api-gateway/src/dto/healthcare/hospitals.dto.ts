import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum HospitalType {
    GOVERNMENT = 'government',
    PRIVATE = 'private',
    TRUST = 'trust',
}

export class CreateHospitalDto {
    @ApiProperty({
        description: 'Hospital name',
        example: 'City General Hospital',
        minLength: 2,
        maxLength: 200,
    })
    name: string;

    @ApiPropertyOptional({
        description: 'Hospital description',
        example: 'Multi-specialty hospital providing comprehensive healthcare services',
    })
    description?: string;

    @ApiProperty({
        description: 'City where hospital is located',
        example: 'Mumbai',
    })
    city: string;

    @ApiProperty({
        description: 'State where hospital is located',
        example: 'Maharashtra',
    })
    state: string;

    @ApiProperty({
        description: 'Postal code',
        example: '400001',
    })
    pincode: string;

    @ApiPropertyOptional({
        description: 'Full address',
        example: '123 MG Road, Fort',
    })
    address?: string;

    @ApiPropertyOptional({
        description: 'Available facilities',
        example: ['ICU', 'Emergency', 'X-Ray', 'Lab', 'Pharmacy'],
        type: [String],
    })
    facilities?: string[];

    @ApiPropertyOptional({
        description: 'Hospital type',
        enum: HospitalType,
        example: HospitalType.GOVERNMENT,
    })
    type?: HospitalType;

    @ApiPropertyOptional({
        description: 'Contact phone number',
        example: '+912234567890',
    })
    contactNumber?: string;

    @ApiPropertyOptional({
        description: 'Contact email address',
        example: 'info@cityhospital.com',
    })
    email?: string;

    @ApiPropertyOptional({
        description: 'Whether hospital is active',
        example: true,
        default: true,
    })
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Total number of beds',
        example: 500,
    })
    totalBeds?: number;

    @ApiPropertyOptional({
        description: 'Number of available beds',
        example: 250,
    })
    availableBeds?: number;
}

export class QueryHospitalDto {
    @ApiPropertyOptional({ description: 'Filter by city', example: 'Mumbai' })
    city?: string;

    @ApiPropertyOptional({ description: 'Filter by state', example: 'Maharashtra' })
    state?: string;

    @ApiPropertyOptional({ description: 'Filter by pincode', example: '400001' })
    pincode?: string;

    @ApiPropertyOptional({ description: 'Filter by hospital type', enum: HospitalType })
    type?: HospitalType;

    @ApiPropertyOptional({ description: 'Search in name and description', example: 'General' })
    search?: string;

    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1, minimum: 1 })
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10, minimum: 1, maximum: 100 })
    limit?: number;
}

export class HospitalResponse {
    @ApiProperty({ description: 'Hospital ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'Hospital name', example: 'City General Hospital' })
    name: string;

    @ApiPropertyOptional({ description: 'Hospital description' })
    description?: string;

    @ApiProperty({ description: 'City', example: 'Mumbai' })
    city: string;

    @ApiProperty({ description: 'State', example: 'Maharashtra' })
    state: string;

    @ApiProperty({ description: 'Pincode', example: '400001' })
    pincode: string;

    @ApiPropertyOptional({ description: 'Full address' })
    address?: string;

    @ApiPropertyOptional({ description: 'Available facilities', type: [String] })
    facilities?: string[];

    @ApiPropertyOptional({ description: 'Hospital type', enum: HospitalType })
    type?: HospitalType;

    @ApiPropertyOptional({ description: 'Contact number' })
    contactNumber?: string;

    @ApiPropertyOptional({ description: 'Contact email' })
    email?: string;

    @ApiProperty({ description: 'Whether hospital is active', example: true })
    isActive: boolean;

    @ApiPropertyOptional({ description: 'Total beds' })
    totalBeds?: number;

    @ApiPropertyOptional({ description: 'Available beds' })
    availableBeds?: number;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;
}
