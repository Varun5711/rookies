import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum GrievanceStatus {
    SUBMITTED = 'submitted',
    UNDER_REVIEW = 'under_review',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
    ESCALATED = 'escalated',
}

export enum GrievancePriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

export class CreateGrievanceDto {
    @ApiProperty({
        description: 'Category ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    categoryId: string;

    @ApiProperty({
        description: 'Grievance title/subject',
        example: 'Broken street light at MG Road',
        minLength: 10,
        maxLength: 200,
    })
    title: string;

    @ApiProperty({
        description: 'Detailed description of the grievance',
        example: 'The street light near house number 42 on MG Road has been broken for the past 2 weeks. It creates safety issues at night.',
        minLength: 20,
        maxLength: 2000,
    })
    description: string;

    @ApiPropertyOptional({
        description: 'Location/address',
        example: '42 MG Road, Near City Mall',
    })
    location?: string;

    @ApiPropertyOptional({
        description: 'Location coordinates',
        example: { lat: 19.0760, lng: 72.8777 },
    })
    coordinates?: {
        lat: number;
        lng: number;
    };

    @ApiPropertyOptional({
        description: 'Pincode',
        example: '400001',
    })
    pincode?: string;

    @ApiPropertyOptional({
        description: 'City',
        example: 'Mumbai',
    })
    city?: string;

    @ApiPropertyOptional({
        description: 'Priority level',
        enum: GrievancePriority,
        default: GrievancePriority.MEDIUM,
    })
    priority?: GrievancePriority;

    @ApiPropertyOptional({
        description: 'Attachment file URLs',
        type: [String],
        example: ['https://storage.example.com/images/broken-light.jpg'],
    })
    attachments?: string[];
}

export class QueryGrievanceDto {
    @ApiPropertyOptional({ description: 'Filter by category ID' })
    categoryId?: string;

    @ApiPropertyOptional({ description: 'Filter by status', enum: GrievanceStatus })
    status?: GrievanceStatus;

    @ApiPropertyOptional({ description: 'Filter by priority', enum: GrievancePriority })
    priority?: GrievancePriority;

    @ApiPropertyOptional({ description: 'Filter by city', example: 'Mumbai' })
    city?: string;

    @ApiPropertyOptional({ description: 'Filter by pincode', example: '400001' })
    pincode?: string;

    @ApiPropertyOptional({ description: 'Search in title and description', example: 'street light' })
    search?: string;

    @ApiPropertyOptional({ description: 'Start date for filter (YYYY-MM-DD)', example: '2026-01-01' })
    fromDate?: string;

    @ApiPropertyOptional({ description: 'End date for filter (YYYY-MM-DD)', example: '2026-01-31' })
    toDate?: string;

    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1, minimum: 1 })
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10, minimum: 1, maximum: 100 })
    limit?: number;
}

export class EscalateGrievanceDto {
    @ApiProperty({
        description: 'Reason for escalation',
        example: 'No response received for over 15 days despite follow-ups',
        minLength: 10,
        maxLength: 500,
    })
    reason: string;
}

export class GrievanceResponse {
    @ApiProperty({ description: 'Grievance ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'Grievance ticket number', example: 'GRV-2026-00001' })
    ticketNumber: string;

    @ApiProperty({ description: 'User ID of the complainant' })
    userId: string;

    @ApiProperty({ description: 'Category ID' })
    categoryId: string;

    @ApiProperty({ description: 'Grievance title' })
    title: string;

    @ApiProperty({ description: 'Detailed description' })
    description: string;

    @ApiProperty({ description: 'Current status', enum: GrievanceStatus })
    status: GrievanceStatus;

    @ApiProperty({ description: 'Priority level', enum: GrievancePriority })
    priority: GrievancePriority;

    @ApiPropertyOptional({ description: 'Location/address' })
    location?: string;

    @ApiPropertyOptional({ description: 'City' })
    city?: string;

    @ApiPropertyOptional({ description: 'Pincode' })
    pincode?: string;

    @ApiPropertyOptional({ description: 'Attachment URLs', type: [String] })
    attachments?: string[];

    @ApiPropertyOptional({ description: 'Escalation reason (if escalated)' })
    escalationReason?: string;

    @ApiPropertyOptional({ description: 'Resolution remarks (if resolved)' })
    resolutionRemarks?: string;

    @ApiPropertyOptional({ description: 'Assigned officer ID' })
    assignedTo?: string;

    @ApiProperty({ description: 'Submission timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;

    @ApiPropertyOptional({ description: 'Resolution timestamp' })
    resolvedAt?: Date;
}
