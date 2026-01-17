import { IsString, IsEnum, IsBoolean, IsOptional, IsArray, IsDateString } from 'class-validator';
import { Season } from '../entities/advisory.entity';

export class CreateAdvisoryDto {
  @IsString()
  cropName: string;

  @IsEnum(Season)
  season: Season;

  @IsString()
  state: string;

  @IsString()
  advisory: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  validFrom?: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;
}
