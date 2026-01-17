import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationConsumer } from '../modules/consumers/notification.consumer';
import { SmsService } from '../modules/services/sms.service';
import { EmailService } from '../modules/services/email.service';
import { HealthModule } from '../modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
  ],
  controllers: [NotificationConsumer],
  providers: [SmsService, EmailService],
})
export class AppModule {}
