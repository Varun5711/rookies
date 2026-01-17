import { IsString, IsOptional, IsObject } from 'class-validator';

export class ApplySchemeDto {
  @IsString()
  @IsOptional()
  applicantName?: string;

  @IsString()
  @IsOptional()
  applicantMobile?: string;

  @IsString()
  @IsOptional()
  applicantAadhar?: string;

  @IsObject()
  @IsOptional()
  formData?: Record<string, any>;

  @IsString({ each: true })
  @IsOptional()
  documentUrls?: string[];
}
