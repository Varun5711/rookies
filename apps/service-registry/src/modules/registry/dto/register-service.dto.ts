import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsBoolean,
  IsArray,
  IsOptional,
  Matches,
} from 'class-validator';

/**
 * Register Service DTO
 * Validates service registration request
 */
export class RegisterServiceDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Service name must be lowercase alphanumeric with hyphens only',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  baseUrl: string;

  @IsString()
  @IsOptional()
  healthEndpoint?: string;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsUrl()
  @IsOptional()
  apiDocsUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredRoles?: string[];
}
