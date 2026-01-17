import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('NotificationSVC');

  // Create HTTP application for health checks
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
        clientId: 'notification-svc',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'notification-consumer-group',
        allowAutoTopicCreation: true,
      },
    },
  });

  // Enable shutdown hooks for graceful shutdown
  app.enableShutdownHooks();

  // Start all microservices
  await app.startAllMicroservices();

  const port = process.env.PORT_NOTIFICATION_SVC || process.env.PORT || 3007;
  await app.listen(port);

  logger.log(
    `Notification Service is running on: http://localhost:${port}/${globalPrefix}`,
  );
  logger.log('Kafka consumer is listening for events');
}

bootstrap();
