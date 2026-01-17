import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsEmail, IsUUID, Min } from 'class-validator';
import { Specialization } from '../entities/doctor.entity';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsEnum(Specialization)
  specialization: Specialization;

  @IsString()
  @IsOptional()
  qualification?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  experienceYears?: number;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  @IsOptional()
  contactNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  consultationFee?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsUUID()
  hospitalId: string;
}
