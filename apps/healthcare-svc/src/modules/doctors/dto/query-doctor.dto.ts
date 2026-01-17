import { IsOptional, IsString, IsEnum, IsNumber, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { Specialization } from '../entities/doctor.entity';

export class QueryDoctorDto {
  @IsUUID()
  @IsOptional()
  hospitalId?: string;

  @IsEnum(Specialization)
  @IsOptional()
  specialization?: Specialization;

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
