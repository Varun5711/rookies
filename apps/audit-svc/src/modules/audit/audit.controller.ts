import { Controller, Get, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { AdminOnly } from '@dpi/common';
import { AuditService, QueryAuditLogDto } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) { }

  @Get('logs')
  @AdminOnly()
  findAll(@Query() query: QueryAuditLogDto) {
    return this.auditService.findAll(query);
  }

  @Get('logs/user/:userId')
  @AdminOnly()
  findByUser(@Param('userId') userId: string) {
    return this.auditService.findByUserId(userId);
  }

  @Get('logs/event/:eventType')
  @AdminOnly()
  findByEventType(@Param('eventType') eventType: string) {
    return this.auditService.findByEventType(eventType);
  }

  @Get('stats')
  @AdminOnly()
  getStats() {
    return this.auditService.getStats();
  }
}
