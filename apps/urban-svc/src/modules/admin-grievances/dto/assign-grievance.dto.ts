import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { GrievancePriority } from '../../grievances/entities/grievance.entity';

export class AssignGrievanceDto {
    @IsOptional()
    @IsString()
    assignedTo?: string;

    @IsOptional()
    @IsString()
    assignedDepartment?: string;

    @IsOptional()
    @IsEnum(GrievancePriority)
    priority?: GrievancePriority;

    @IsOptional()
    @IsString()
    escalationReason?: string;
}
