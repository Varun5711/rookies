import { Controller, Get } from '@nestjs/common';
import { Public } from '@dpi/common';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  check() {
    return {
      status: 'healthy',
      service: 'agriculture-svc',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
