import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { SchemeCategory } from '../../schemes/entities/scheme.entity';

export class CreateSchemeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(SchemeCategory)
    category: SchemeCategory;

    @IsNumber()
    benefitAmount: number;

    @IsOptional()
    @IsArray()
    requiredDocuments?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsString()
    ministryName?: string;

    @IsOptional()
    @IsNumber()
    totalBudget?: number;

    @IsOptional()
    eligibilityCriteria?: Record<string, any>;
}
