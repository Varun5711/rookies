import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AdvisoryType {
    WEATHER = 'weather',
    PEST_CONTROL = 'pest_control',
    CROP_MANAGEMENT = 'crop_management',
    IRRIGATION = 'irrigation',
    HARVEST = 'harvest',
    MARKET = 'market',
}

export enum AdvisorySeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export class QueryAdvisoryDto {
    @ApiPropertyOptional({ description: 'Filter by advisory type', enum: AdvisoryType })
    type?: AdvisoryType;

    @ApiPropertyOptional({ description: 'Filter by crop', example: 'Rice' })
    crop?: string;

    @ApiPropertyOptional({ description: 'Filter by state', example: 'Maharashtra' })
    state?: string;

    @ApiPropertyOptional({ description: 'Filter by district', example: 'Pune' })
    district?: string;

    @ApiPropertyOptional({ description: 'Filter by severity', enum: AdvisorySeverity })
    severity?: AdvisorySeverity;

    @ApiPropertyOptional({ description: 'Filter active advisories only', example: true })
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1, minimum: 1 })
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10, minimum: 1, maximum: 100 })
    limit?: number;
}

export class AdvisoryResponse {
    @ApiProperty({ description: 'Advisory ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'Advisory title', example: 'Heavy Rainfall Alert - Maharashtra' })
    title: string;

    @ApiProperty({ description: 'Detailed advisory message' })
    message: string;

    @ApiProperty({ description: 'Advisory type', enum: AdvisoryType })
    type: AdvisoryType;

    @ApiProperty({ description: 'Severity level', enum: AdvisorySeverity })
    severity: AdvisorySeverity;

    @ApiPropertyOptional({ description: 'Applicable crops', type: [String] })
    crops?: string[];

    @ApiPropertyOptional({ description: 'Applicable states', type: [String] })
    states?: string[];

    @ApiPropertyOptional({ description: 'Applicable districts', type: [String] })
    districts?: string[];

    @ApiPropertyOptional({ description: 'Valid from date' })
    validFrom?: Date;

    @ApiPropertyOptional({ description: 'Valid until date' })
    validUntil?: Date;

    @ApiProperty({ description: 'Whether advisory is active', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;
}
