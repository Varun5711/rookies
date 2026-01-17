import { IsOptional, IsEnum, IsNumber, Min, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { GrievanceStatus, GrievancePriority } from '../entities/grievance.entity';

export class QueryGrievanceDto {
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsEnum(GrievanceStatus)
  @IsOptional()
  status?: GrievanceStatus;

  @IsEnum(GrievancePriority)
  @IsOptional()
  priority?: GrievancePriority;

  @IsString()
  @IsOptional()
  ward?: string;

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
