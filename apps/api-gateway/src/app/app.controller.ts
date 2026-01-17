import { Controller, Get } from '@nestjs/common';
import { Public } from '@dpi/common';
import { AppService } from './app.service';

/**
 * App Controller
 * Provides gateway health and info endpoints
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getData() {
    return this.appService.getData();
  }

  @Public()
  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    };
  }
}
