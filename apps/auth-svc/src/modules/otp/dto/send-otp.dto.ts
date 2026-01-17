import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

/**
 * Send OTP DTO
 * Validates mobile number for OTP sending
 */
export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, { message: 'Mobile number must be exactly 10 digits' })
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Invalid Indian mobile number. Must start with 6-9 and be 10 digits.',
  })
  mobile: string;
}
