import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RegistryProxyController } from './registry-proxy.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    ProxyModule,
  ],
  controllers: [RegistryProxyController],
})
export class RegistryProxyModule {}
