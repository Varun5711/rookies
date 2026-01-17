import { IsString, IsOptional, IsUUID, IsEnum, IsNumber, IsEmail, IsArray, Min, Max } from 'class-validator';
import { GrievancePriority } from '../entities/grievance.entity';

export class CreateGrievanceDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  complainantName?: string;

  @IsString()
  @IsOptional()
  complainantMobile?: string;

  @IsEmail()
  @IsOptional()
  complainantEmail?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  ward?: string;

  @IsString()
  @IsOptional()
  pincode?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @IsEnum(GrievancePriority)
  @IsOptional()
  priority?: GrievancePriority;
}
