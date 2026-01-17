import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('APIGateway');
  const app = await NestFactory.create(AppModule, {
    // Buffer logs during startup
    bufferLogs: true,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Enable CORS for frontend applications
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id'],
    exposedHeaders: ['x-correlation-id', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials: true,
  });

  // Validation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable shutdown hooks for graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT_API_GATEWAY || process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
    `API Gateway is running on: http://localhost:${port}/${globalPrefix}`,
  );
  logger.log(`Routes available:`);
  logger.log(`  - GET  /api/health - Health check`);
  logger.log(`  - ALL  /api/auth/* - Authentication (proxy to auth-svc)`);
  logger.log(`  - ALL  /api/services/:serviceName/* - Dynamic service routing`);
}

bootstrap();
