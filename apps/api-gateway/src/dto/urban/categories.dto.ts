import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponse {
    @ApiProperty({ description: 'Category ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'Category name', example: 'Street Lighting' })
    name: string;

    @ApiProperty({ description: 'Category description', example: 'Issues related to street lights, lamp posts, and public area lighting' })
    description: string;

    @ApiPropertyOptional({ description: 'Department responsible', example: 'Municipal Corporation - Electrical Department' })
    department?: string;

    @ApiPropertyOptional({ description: 'Expected resolution time in days', example: 7 })
    slaInDays?: number;

    @ApiPropertyOptional({ description: 'Parent category ID (for sub-categories)' })
    parentId?: string;

    @ApiProperty({ description: 'Whether category is active', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Display order', example: 1 })
    displayOrder: number;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;
}

export class QueryCategoryDto {
    @ApiPropertyOptional({ description: 'Filter by active status', example: true })
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Filter by parent category (null for root categories)' })
    parentId?: string;

    @ApiPropertyOptional({ description: 'Search in name and description', example: 'lighting' })
    search?: string;
}
