import { IsOptional, IsEnum, IsNumber, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from '../entities/application.entity';

export class QueryApplicationDto {
  @IsUUID()
  @IsOptional()
  schemeId?: string;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

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
