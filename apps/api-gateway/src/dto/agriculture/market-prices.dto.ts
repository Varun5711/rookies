import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CropCategory {
    VEGETABLES = 'vegetables',
    FRUITS = 'fruits',
    GRAINS = 'grains',
    PULSES = 'pulses',
    SPICES = 'spices',
    OILSEEDS = 'oilseeds',
    CASH_CROPS = 'cash_crops',
}

export class QueryMarketPriceDto {
    @ApiPropertyOptional({ description: 'Filter by crop name', example: 'Tomato' })
    crop?: string;

    @ApiPropertyOptional({ description: 'Filter by category', enum: CropCategory })
    category?: CropCategory;

    @ApiPropertyOptional({ description: 'Filter by market/mandi name', example: 'Azadpur' })
    market?: string;

    @ApiPropertyOptional({ description: 'Filter by state', example: 'Maharashtra' })
    state?: string;

    @ApiPropertyOptional({ description: 'Filter by district', example: 'Pune' })
    district?: string;

    @ApiPropertyOptional({ description: 'Start date for price data (YYYY-MM-DD)', example: '2026-01-01' })
    fromDate?: string;

    @ApiPropertyOptional({ description: 'End date for price data (YYYY-MM-DD)', example: '2026-01-31' })
    toDate?: string;

    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1, minimum: 1 })
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10, minimum: 1, maximum: 100 })
    limit?: number;
}

export class MarketPriceResponse {
    @ApiProperty({ description: 'Price record ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'Crop name', example: 'Tomato' })
    crop: string;

    @ApiProperty({ description: 'Crop category', enum: CropCategory })
    category: CropCategory;

    @ApiProperty({ description: 'Market/Mandi name', example: 'Azadpur Mandi' })
    market: string;

    @ApiProperty({ description: 'State', example: 'Delhi' })
    state: string;

    @ApiProperty({ description: 'District', example: 'North Delhi' })
    district: string;

    @ApiProperty({ description: 'Minimum price per quintal in INR', example: 1500 })
    minPrice: number;

    @ApiProperty({ description: 'Maximum price per quintal in INR', example: 2500 })
    maxPrice: number;

    @ApiProperty({ description: 'Modal (most common) price per quintal in INR', example: 2000 })
    modalPrice: number;

    @ApiProperty({ description: 'Price date', example: '2026-01-18' })
    date: string;

    @ApiProperty({ description: 'Record timestamp' })
    createdAt: Date;
}
