import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ResponseTransformInterceptor } from './interceptors/response-transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

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
    exposedHeaders: [
      'x-correlation-id',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
    credentials: true,
  });

  // Global exception filters (order matters - AllExceptionsFilter is fallback)
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // Global response interceptor for standardized response format
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

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

  // ========== SWAGGER CONFIGURATION ==========
  const config = new DocumentBuilder()
    .setTitle('DPI Platform API')
    .setDescription(`
## Digital Public Infrastructure Platform API Documentation

This API provides access to all DPI microservices through a single gateway.

### Authentication

Most endpoints require Bearer JWT authentication. You can obtain a JWT token by:

1. **Mobile OTP Authentication:**
   - POST \`/api/auth/otp/send\` - Send OTP to your mobile number
   - POST \`/api/auth/otp/verify\` - Verify OTP and get tokens

2. **Google OAuth Authentication:**
   - GET \`/api/auth/google/login\` - Redirect to Google OAuth
   - GET \`/api/auth/google/callback\` - OAuth callback with tokens

Once you have a token, click the **"Authorize"** button below and enter:
\`Bearer YOUR_JWT_TOKEN\`

### Services

| Service | Base Path | Description |
|---------|-----------|-------------|
| Auth | /api/auth | Authentication & user management |
| Healthcare | /api/services/healthcare | Hospitals, doctors, appointments |
| Agriculture | /api/services/agriculture | Schemes, market prices, advisories |
| Urban | /api/services/urban | Grievances, civic services |
| Audit | /api/services/audit | Audit logs & analytics |
| Analytics | /api/services/analytics | Platform analytics & reports |
| Registry | /api/registry | Service registry & discovery |

### Public Endpoints (No Authentication Required)

- \`GET /api/health\` - Health check
- \`POST /api/auth/otp/send\` - Send OTP
- \`POST /api/auth/otp/verify\` - Verify OTP
- \`GET /api/auth/google/login\` - Google OAuth login
- \`GET /api/services/healthcare/hospitals\` - List hospitals
- \`GET /api/services/healthcare/doctors\` - List doctors
- \`GET /api/services/agriculture/schemes\` - List schemes
- \`GET /api/services/agriculture/market-prices\` - Market prices
- \`GET /api/services/agriculture/advisories\` - Advisories
- \`GET /api/services/urban/categories\` - List grievance categories

### Rate Limiting

- Global: 100 requests/minute per user
- OTP: 3 OTP sends per 10 minutes per mobile number

### Correlation ID

Include \`x-correlation-id\` header in requests for request tracking across microservices.

### User Roles

| Role | Description |
|------|-------------|
| \`citizen\` | Regular user - can access all citizen services |
| \`service_provider\` | Hospital/service staff - can manage resources |
| \`platform_admin\` | Administrator - full platform access |
    `)
    .setVersion('1.0.0')
    .addTag('Health', 'Health check endpoints')
    .addTag('Authentication', 'OAuth and OTP authentication')
    .addTag('Healthcare Services', 'Hospitals, doctors, and appointments')
    .addTag('Agriculture Services', 'Schemes, prices, and advisories')
    .addTag('Urban Services', 'Grievances and civic services')
    .addTag('Audit Services', 'Audit logs and analytics')
    .addTag('Analytics Services', 'Platform analytics and reports')
    .addTag('Service Registry', 'Service discovery and registration')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token (e.g., "eyJhbGci..."). Get token from /api/auth/otp/verify or /api/auth/google/callback',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Development')
    .addServer('https://api.dpi-platform.gov.in', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'DPI Platform API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .info .title { color: #3b4151 }
      .swagger-ui .scheme-container { background: #fafafa; padding: 10px }
    `,
  });

  // ===========================================

  const port = process.env.PORT_API_GATEWAY || process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
    `🚀 API Gateway is running on: http://localhost:${port}/${globalPrefix}`,
  );
  logger.log(
    `📚 Swagger documentation: http://localhost:${port}/${globalPrefix}/docs`,
  );
  logger.log(`Routes available:`);
  logger.log(`  - GET  /api/health - Health check`);
  logger.log(`  - ALL  /api/auth/* - Authentication (proxy to auth-svc)`);
  logger.log(`  - ALL  /api/services/:serviceName/* - Dynamic service routing`);
  logger.log(`  - ALL  /api/registry/* - Service registry`);
}

bootstrap();
