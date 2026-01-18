import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    description: 'Mobile number (10 digits)',
    example: '9876543210',
    minLength: 10,
    maxLength: 10,
    pattern: '^[6-9]\\d{9}$',
  })
  mobile: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Mobile number (10 digits)',
    example: '9876543210',
    minLength: 10,
    maxLength: 10,
  })
  mobile: string;

  @ApiProperty({
    description: 'OTP received on mobile',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  otp: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token obtained during authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

export class UserResponse {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({ description: 'Mobile number', example: '9876543210' })
  mobile: string;

  @ApiPropertyOptional({ description: 'Full name', example: 'John Doe' })
  fullName?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiProperty({ description: 'Whether mobile is verified', example: true })
  mobileVerified: boolean;

  @ApiProperty({
    description: 'User roles',
    example: ['citizen'],
    enum: ['citizen', 'service_provider', 'platform_admin'],
  })
  roles: string[];
}

export class TokensResponse {
  @ApiProperty({ description: 'JWT access token (valid for 15 minutes)' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token (valid for 7 days)' })
  refreshToken: string;

  @ApiProperty({
    description: 'Access token expiration time in seconds',
    example: 900,
  })
  expiresIn: number;
}

export class AuthSuccessResponse {
  @ApiProperty({ example: true, description: 'Authentication successful' })
  success: true;

  @ApiProperty({
    description: 'Authentication message',
    example: 'OTP verified successfully',
  })
  message: string;

  @ApiProperty({ description: 'User information', type: UserResponse })
  user: UserResponse;

  @ApiProperty({ description: 'JWT tokens', type: TokensResponse })
  tokens: TokensResponse;
}
