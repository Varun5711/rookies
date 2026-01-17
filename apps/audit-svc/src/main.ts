import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('AuditSVC');

  // Create HTTP application for API endpoints
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Validation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Connect Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'audit-svc',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'audit-consumer-group',
        allowAutoTopicCreation: true,
      },
    },
  });

  // Enable shutdown hooks for graceful shutdown
  app.enableShutdownHooks();

  // Start all microservices
  await app.startAllMicroservices();

  const port = process.env.PORT_AUDIT_SVC || process.env.PORT || 3008;
  await app.listen(port);

  logger.log(
    `Audit Service is running on: http://localhost:${port}/${globalPrefix}`,
  );
  logger.log('Kafka consumer is listening for all events');
}

bootstrap();
