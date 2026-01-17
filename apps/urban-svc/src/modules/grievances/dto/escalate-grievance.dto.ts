import { IsString, IsOptional, IsEnum } from 'class-validator';
import { GrievancePriority } from '../entities/grievance.entity';

export class EscalateGrievanceDto {
  @IsString()
  reason: string;

  @IsEnum(GrievancePriority)
  @IsOptional()
  newPriority?: GrievancePriority;
}
