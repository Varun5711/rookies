import { IsString, IsOptional, IsArray, IsEnum, IsBoolean, IsNumber, IsEmail } from 'class-validator';
import { HospitalType } from '../entities/hospital.entity';

export class CreateHospitalDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  facilities?: string[];

  @IsEnum(HospitalType)
  @IsOptional()
  type?: HospitalType;

  @IsString()
  @IsOptional()
  contactNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  totalBeds?: number;

  @IsNumber()
  @IsOptional()
  availableBeds?: number;
}
