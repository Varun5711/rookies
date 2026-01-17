import { IsOptional, IsString, IsEnum, IsNumber, Min, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { SchemeCategory } from '../entities/scheme.entity';

export class QuerySchemeDto {
  @IsEnum(SchemeCategory)
  @IsOptional()
  category?: SchemeCategory;

  @IsString()
  @IsOptional()
  search?: string;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  activeOnly?: boolean = true;

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
