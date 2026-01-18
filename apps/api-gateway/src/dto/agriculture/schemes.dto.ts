import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SchemeCategory {
    CROP_INSURANCE = 'crop_insurance',
    SUBSIDY = 'subsidy',
    LOAN = 'loan',
    TRAINING = 'training',
    EQUIPMENT = 'equipment',
    MARKET_ACCESS = 'market_access',
}

export enum ApplicationStatus {
    PENDING = 'pending',
    UNDER_REVIEW = 'under_review',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    DISBURSED = 'disbursed',
}

export class QuerySchemeDto {
    @ApiPropertyOptional({ description: 'Filter by category', enum: SchemeCategory })
    category?: SchemeCategory;

    @ApiPropertyOptional({ description: 'Filter by state', example: 'Maharashtra' })
    state?: string;

    @ApiPropertyOptional({ description: 'Filter by active schemes only', example: true })
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Search in name and description', example: 'crop insurance' })
    search?: string;

    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1, minimum: 1 })
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10, minimum: 1, maximum: 100 })
    limit?: number;
}

export class ApplySchemeDto {
    @ApiPropertyOptional({
        description: 'Applicant name (if different from registered name)',
        example: 'Ramesh Patel',
    })
    applicantName?: string;

    @ApiProperty({
        description: 'Land area in hectares',
        example: 5.5,
        minimum: 0.1,
    })
    landArea: number;

    @ApiProperty({
        description: 'Crop type',
        example: 'Wheat',
    })
    cropType: string;

    @ApiPropertyOptional({
        description: 'Annual income in INR',
        example: 250000,
    })
    annualIncome?: number;

    @ApiPropertyOptional({
        description: 'Bank account number for disbursement',
        example: '1234567890123456',
    })
    bankAccount?: string;

    @ApiPropertyOptional({
        description: 'IFSC code',
        example: 'SBIN0001234',
    })
    ifscCode?: string;

    @ApiPropertyOptional({
        description: 'Additional documents or notes',
        example: 'Land ownership documents attached',
    })
    notes?: string;
}

export class QueryApplicationDto {
    @ApiPropertyOptional({ description: 'Filter by status', enum: ApplicationStatus })
    status?: ApplicationStatus;

    @ApiPropertyOptional({ description: 'Filter by scheme ID' })
    schemeId?: string;

    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1, minimum: 1 })
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10, minimum: 1, maximum: 100 })
    limit?: number;
}

export class SchemeResponse {
    @ApiProperty({ description: 'Scheme ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'Scheme name', example: 'Pradhan Mantri Fasal Bima Yojana' })
    name: string;

    @ApiProperty({ description: 'Scheme description' })
    description: string;

    @ApiProperty({ description: 'Scheme category', enum: SchemeCategory })
    category: SchemeCategory;

    @ApiPropertyOptional({ description: 'Eligibility criteria' })
    eligibility?: string;

    @ApiPropertyOptional({ description: 'List of benefits', type: [String] })
    benefits?: string[];

    @ApiPropertyOptional({ description: 'Required documents', type: [String] })
    requiredDocuments?: string[];

    @ApiPropertyOptional({ description: 'Application deadline' })
    deadline?: Date;

    @ApiPropertyOptional({ description: 'Budget allocation in INR' })
    budgetAllocation?: number;

    @ApiProperty({ description: 'Whether scheme is active', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;
}

export class ApplicationResponse {
    @ApiProperty({ description: 'Application ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'User ID' })
    userId: string;

    @ApiProperty({ description: 'Scheme ID' })
    schemeId: string;

    @ApiProperty({ description: 'Application status', enum: ApplicationStatus })
    status: ApplicationStatus;

    @ApiPropertyOptional({ description: 'Applicant name' })
    applicantName?: string;

    @ApiProperty({ description: 'Land area in hectares' })
    landArea: number;

    @ApiProperty({ description: 'Crop type' })
    cropType: string;

    @ApiPropertyOptional({ description: 'Annual income' })
    annualIncome?: number;

    @ApiPropertyOptional({ description: 'Remarks from reviewer' })
    remarks?: string;

    @ApiProperty({ description: 'Application timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;
}
