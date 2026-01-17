import { Controller, Get, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { AuditService, QueryAuditLogDto } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  findAll(@Query() query: QueryAuditLogDto) {
    return this.auditService.findAll(query);
  }

  @Get('logs/user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.auditService.findByUserId(userId);
  }

  @Get('logs/event/:eventType')
  findByEventType(@Param('eventType') eventType: string) {
    return this.auditService.findByEventType(eventType);
  }

  @Get('stats')
  getStats() {
    return this.auditService.getStats();
  }
}
