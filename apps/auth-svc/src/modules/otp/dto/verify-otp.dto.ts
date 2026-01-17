import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

/**
 * Verify OTP DTO
 * Validates mobile number and OTP for verification
 */
export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, { message: 'Mobile number must be exactly 10 digits' })
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Invalid Indian mobile number. Must start with 6-9 and be 10 digits.',
  })
  mobile: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
  otp: string;
}
