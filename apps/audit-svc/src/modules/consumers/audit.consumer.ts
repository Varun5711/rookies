import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  KafkaContext,
} from '@nestjs/microservices';
import {
  HealthcareEventTopics,
  AgricultureEventTopics,
  UrbanEventTopics,
} from '@dpi/kafka';
import { AuditService } from '../audit/audit.service';

@Controller()
export class AuditConsumer {
  private readonly logger = new Logger(AuditConsumer.name);

  constructor(private readonly auditService: AuditService) {}

  // Healthcare Events
  @EventPattern(HealthcareEventTopics.APPOINTMENT_BOOKED)
  async handleAppointmentBooked(
    @Payload() data: any,
    @Ctx() context: KafkaContext,
  ) {
    await this.logEvent(
      HealthcareEventTopics.APPOINTMENT_BOOKED,
      'healthcare-svc',
      'HEALTHCARE',
      data,
    );
  }

  @EventPattern(HealthcareEventTopics.APPOINTMENT_CANCELLED)
  async handleAppointmentCancelled(@Payload() data: any) {
    await this.logEvent(
      HealthcareEventTopics.APPOINTMENT_CANCELLED,
      'healthcare-svc',
      'HEALTHCARE',
      data,
    );
  }

  @EventPattern(HealthcareEventTopics.APPOINTMENT_UPDATED)
  async handleAppointmentUpdated(@Payload() data: any) {
    await this.logEvent(
      HealthcareEventTopics.APPOINTMENT_UPDATED,
      'healthcare-svc',
      'HEALTHCARE',
      data,
    );
  }

  // Agriculture Events
  @EventPattern(AgricultureEventTopics.SCHEME_APPLIED)
  async handleSchemeApplied(@Payload() data: any) {
    await this.logEvent(
      AgricultureEventTopics.SCHEME_APPLIED,
      'agriculture-svc',
      'AGRICULTURE',
      data,
    );
  }

  @EventPattern(AgricultureEventTopics.SCHEME_APPROVED)
  async handleSchemeApproved(@Payload() data: any) {
    await this.logEvent(
      AgricultureEventTopics.SCHEME_APPROVED,
      'agriculture-svc',
      'AGRICULTURE',
      data,
    );
  }

  @EventPattern(AgricultureEventTopics.SCHEME_REJECTED)
  async handleSchemeRejected(@Payload() data: any) {
    await this.logEvent(
      AgricultureEventTopics.SCHEME_REJECTED,
      'agriculture-svc',
      'AGRICULTURE',
      data,
    );
  }

  @EventPattern(AgricultureEventTopics.ADVISORY_PUBLISHED)
  async handleAdvisoryPublished(@Payload() data: any) {
    await this.logEvent(
      AgricultureEventTopics.ADVISORY_PUBLISHED,
      'agriculture-svc',
      'AGRICULTURE',
      data,
    );
  }

  // Urban Events
  @EventPattern(UrbanEventTopics.GRIEVANCE_SUBMITTED)
  async handleGrievanceSubmitted(@Payload() data: any) {
    await this.logEvent(
      UrbanEventTopics.GRIEVANCE_SUBMITTED,
      'urban-svc',
      'URBAN',
      data,
    );
  }

  @EventPattern(UrbanEventTopics.GRIEVANCE_RESOLVED)
  async handleGrievanceResolved(@Payload() data: any) {
    await this.logEvent(
      UrbanEventTopics.GRIEVANCE_RESOLVED,
      'urban-svc',
      'URBAN',
      data,
    );
  }

  @EventPattern(UrbanEventTopics.GRIEVANCE_ESCALATED)
  async handleGrievanceEscalated(@Payload() data: any) {
    await this.logEvent(
      UrbanEventTopics.GRIEVANCE_ESCALATED,
      'urban-svc',
      'URBAN',
      data,
    );
  }

  @EventPattern(UrbanEventTopics.GRIEVANCE_UPDATED)
  async handleGrievanceUpdated(@Payload() data: any) {
    await this.logEvent(
      UrbanEventTopics.GRIEVANCE_UPDATED,
      'urban-svc',
      'URBAN',
      data,
    );
  }

  private async logEvent(
    eventType: string,
    serviceName: string,
    eventSource: string,
    eventData: any,
  ) {
    try {
      this.logger.log(`Logging event: ${eventType} from ${serviceName}`);

      await this.auditService.create({
        event_type: eventType,
        userId: eventData.userId,
        serviceName,
        eventSource,
        eventData,
        correlationId: eventData.correlationId,
      });

      this.logger.debug(`Event logged successfully: ${eventType}`);
    } catch (error) {
      this.logger.error(
        `Failed to log event ${eventType}: ${error.message}`,
        error.stack,
      );
    }
  }
}
