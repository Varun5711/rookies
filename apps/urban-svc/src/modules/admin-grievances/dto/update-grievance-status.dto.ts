import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GrievanceStatus } from '../../grievances/entities/grievance.entity';

export class UpdateGrievanceStatusDto {
    @IsEnum(GrievanceStatus)
    status: GrievanceStatus;

    @IsOptional()
    @IsString()
    resolution?: string;

    @IsOptional()
    @IsString()
    rejectionReason?: string;
}
