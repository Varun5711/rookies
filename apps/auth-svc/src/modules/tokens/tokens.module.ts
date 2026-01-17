import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

/**
 * Tokens Module
 * Provides JWT token generation, validation, and refresh functionality
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
      },
    }),
    UsersModule,
  ],
  controllers: [TokensController],
  providers: [TokensService, JwtStrategy],
  exports: [TokensService, JwtModule, JwtStrategy],
})
export class TokensModule {}
