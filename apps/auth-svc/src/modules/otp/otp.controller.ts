import { Controller, Post, Body, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { OtpService } from './otp.service';
import { TokensService } from '../tokens/tokens.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Public } from '@dpi/common';

/**
 * OTP Controller
 * Handles Mobile OTP authentication endpoints
 *
 * Endpoints:
 * - POST /auth/otp/send - Send OTP to mobile number
 * - POST /auth/otp/verify - Verify OTP and authenticate user
 */
@Controller('otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly tokensService: TokensService,
  ) {}

  /**
   * Send OTP to mobile number
   * Rate limited: 3 requests per 10 minutes
   *
   * @param sendOtpDto - Mobile number
   * @returns Success message with expiration time
   */
  @Public()
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    const result = await this.otpService.sendOTP(sendOtpDto.mobile);

    return {
      success: true,
      message: 'OTP sent successfully',
      expiresIn: result.expiresIn,
    };
  }

  /**
   * Verify OTP and authenticate user
   * Creates/updates user and returns user data
   *
   * @param verifyOtpDto - Mobile number and OTP
   * @returns User object with JWT tokens
   */
  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Req() req: Request) {
    const user = await this.otpService.verifyOTP(
      verifyOtpDto.mobile,
      verifyOtpDto.otp
    );

    // Generate JWT tokens
    const tokens = await this.tokensService.generateTokens(user, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return {
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: user.id,
        mobile: user.mobile,
        fullName: user.fullName,
        mobileVerified: user.mobileVerified,
        roles: user.roles,
      },
      tokens,
    };
  }
}
