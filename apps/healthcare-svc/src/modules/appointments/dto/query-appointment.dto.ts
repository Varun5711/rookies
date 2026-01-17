import { IsOptional, IsEnum, IsNumber, Min, IsUUID, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '../entities/appointment.entity';

export class QueryAppointmentDto {
  @IsUUID()
  @IsOptional()
  doctorId?: string;

  @IsUUID()
  @IsOptional()
  hospitalId?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @IsDateString()
  @IsOptional()
  toDate?: string;

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
