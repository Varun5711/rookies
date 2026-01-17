import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsUUID, Min, Max } from 'class-validator';
import { DayOfWeek } from '../entities/time-slot.entity';

export class CreateTimeSlotDto {
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsNumber()
  @Min(5)
  @Max(60)
  @IsOptional()
  slotDurationMinutes?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxPatients?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsUUID()
  doctorId: string;
}
