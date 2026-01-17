import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthProxyController } from './auth-proxy.controller';

/**
 * Auth Proxy Module
 * Provides dedicated proxy routing for authentication endpoints.
 *
 * All /api/auth/* requests are forwarded directly to auth-svc
 * without going through dynamic service discovery.
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AuthProxyController],
})
export class AuthProxyModule {}
