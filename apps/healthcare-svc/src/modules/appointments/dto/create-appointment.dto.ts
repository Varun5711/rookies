import { IsString, IsOptional, IsUUID, IsDateString, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  doctorId: string;

  @IsUUID()
  hospitalId: string;

  @IsDateString()
  appointmentDate: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'appointmentTime must be in HH:mm format',
  })
  appointmentTime: string;

  @IsString()
  @IsOptional()
  patientName?: string;

  @IsString()
  @IsOptional()
  patientMobile?: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
