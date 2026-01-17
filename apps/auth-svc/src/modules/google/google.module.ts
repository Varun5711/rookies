import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { RedisModule } from '@dpi/redis';

/**
 * Google OAuth Module
 * Provides Google OAuth 2.0 authentication functionality
 */
@Module({
  imports: [
    HttpModule,
    RedisModule,
    UsersModule,
    TokensModule,
  ],
  controllers: [GoogleController],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
