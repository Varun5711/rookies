import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@dpi/database';
import { KafkaModule } from '@dpi/kafka';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HospitalsModule } from '../modules/hospitals/hospitals.module';
import { DoctorsModule } from '../modules/doctors/doctors.module';
import { AppointmentsModule } from '../modules/appointments/appointments.module';

/**
 * Healthcare Service Module
 * Domain service for healthcare operations
 *
 * Features:
 * - Hospital management
 * - Doctor directory
 * - Appointment booking
 * - Time slot management
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (connects to ingenium_healthcare)
    DatabaseModule.forRoot({ serviceName: 'HEALTHCARE' }),

    // Kafka for event streaming
    KafkaModule.register({
      clientId: 'healthcare-svc',
      brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
    }),

    // Feature modules
    HospitalsModule,
    DoctorsModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
