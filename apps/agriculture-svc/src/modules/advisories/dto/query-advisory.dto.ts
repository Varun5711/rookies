import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Season, AdvisoryCategory } from '../entities/advisory.entity';

export class QueryAdvisoryDto {
  @IsString()
  @IsOptional()
  cropName?: string;

  @IsEnum(Season)
  @IsOptional()
  season?: Season;

  @IsEnum(AdvisoryCategory)
  @IsOptional()
  category?: AdvisoryCategory;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
