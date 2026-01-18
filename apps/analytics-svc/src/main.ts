import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('AnalyticsSVC');

  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableShutdownHooks();

  const port = process.env.PORT_ANALYTICS_SVC || 3011;
  await app.listen(port);

  logger.log(
    `Analytics Service is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
