import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApplicationStatus } from '../../schemes/entities/application.entity';

export class UpdateApplicationStatusDto {
    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;

    @IsOptional()
    @IsString()
    rejectionReason?: string;

    @IsOptional()
    @IsNumber()
    disbursedAmount?: number;
}
