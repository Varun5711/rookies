import { PartialType } from '@nestjs/mapped-types';
import { RegisterServiceDto } from './register-service.dto';
import { IsEnum, IsOptional } from 'class-validator';

/**
 * Update Service DTO
 * All fields are optional for partial updates
 */
export class UpdateServiceDto extends PartialType(RegisterServiceDto) {
  @IsEnum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'])
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}
