import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { TwilioService } from './twilio.service';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { RedisModule } from '@dpi/redis';

/**
 * OTP Module
 * Provides Mobile OTP authentication functionality via Twilio
 */
@Module({
  imports: [RedisModule, UsersModule, TokensModule],
  controllers: [OtpController],
  providers: [OtpService, TwilioService],
  exports: [OtpService, TwilioService],
})
export class OtpModule {}
