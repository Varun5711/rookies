import { Controller, Get, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { Roles, UserRole } from '@dpi/common';
import { AuditService, QueryAuditLogDto } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.DEPARTMENT_ADMIN)
  findAll(@Query() query: QueryAuditLogDto) {
    return this.auditService.findAll(query);
  }

  @Get('logs/user/:userId')
  @Roles(UserRole.PLATFORM_ADMIN)
  findByUser(@Param('userId') userId: string) {
    return this.auditService.findByUserId(userId);
  }

  @Get('logs/event/:eventType')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.DEPARTMENT_ADMIN)
  findByEventType(@Param('eventType') eventType: string) {
    return this.auditService.findByEventType(eventType);
  }

  @Get('stats')
  @Roles(UserRole.PLATFORM_ADMIN)
  getStats() {
    return this.auditService.getStats();
  }
}
