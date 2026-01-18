import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsDateString, IsArray, IsObject } from 'class-validator';
import { SchemeCategory } from '../../schemes/entities/scheme.entity';

export class CreateSchemeDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsEnum(SchemeCategory)
    category: SchemeCategory;

    @IsNumber()
    benefitAmount: number;

    @IsOptional()
    @IsObject()
    eligibilityCriteria?: Record<string, any>;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    requiredDocuments?: string[];

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
    @IsString()
    officialLink?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsNumber()
    totalBudget?: number;
}
