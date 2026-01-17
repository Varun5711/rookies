import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  HealthcareEventTopics,
  AgricultureEventTopics,
  UrbanEventTopics,
  AppointmentBookedEvent,
  AppointmentCancelledEvent,
  SchemeAppliedEvent,
  GrievanceSubmittedEvent,
  GrievanceResolvedEvent,
} from '@dpi/kafka';
import { SmsService } from '../services/sms.service';
import { EmailService } from '../services/email.service';

@Controller()
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
  ) {}

  @EventPattern(HealthcareEventTopics.APPOINTMENT_BOOKED)
  async handleAppointmentBooked(@Payload() data: AppointmentBookedEvent) {
    this.logger.log(`Received appointment booked event: ${JSON.stringify(data)}`);

    try {
      // In a real scenario, we'd fetch user details from auth service
      // For now, we'll log the notification
      this.logger.log(
        `Appointment confirmation notification for user ${data.userId}: ` +
          `Appointment on ${data.appointmentDate} at ${data.appointmentTime}`,
      );

      // If we had user phone/email, we'd send notifications here
      // await this.smsService.sendAppointmentConfirmation(userPhone, doctorName, date, time);
    } catch (error) {
      this.logger.error(`Error processing appointment booked event: ${error.message}`, error.stack);
    }
  }

  @EventPattern(HealthcareEventTopics.APPOINTMENT_CANCELLED)
  async handleAppointmentCancelled(@Payload() data: AppointmentCancelledEvent) {
    this.logger.log(`Received appointment cancelled event: ${JSON.stringify(data)}`);

    try {
      this.logger.log(
        `Appointment cancellation notification for user ${data.userId}: ` +
          `Reason: ${data.cancellationReason || 'Not specified'}`,
      );
    } catch (error) {
      this.logger.error(`Error processing appointment cancelled event: ${error.message}`, error.stack);
    }
  }

  @EventPattern(AgricultureEventTopics.SCHEME_APPLIED)
  async handleSchemeApplied(@Payload() data: SchemeAppliedEvent) {
    this.logger.log(`Received scheme applied event: ${JSON.stringify(data)}`);

    try {
      this.logger.log(
        `Scheme application notification for user ${data.userId}: ` +
          `Application ${data.applicationId} for scheme ${data.schemeName}`,
      );
    } catch (error) {
      this.logger.error(`Error processing scheme applied event: ${error.message}`, error.stack);
    }
  }

  @EventPattern(UrbanEventTopics.GRIEVANCE_SUBMITTED)
  async handleGrievanceSubmitted(@Payload() data: GrievanceSubmittedEvent) {
    this.logger.log(`Received grievance submitted event: ${JSON.stringify(data)}`);

    try {
      this.logger.log(
        `Grievance submission notification for user ${data.userId}: ` +
          `Grievance ${data.grievanceId} - ${data.title} (${data.category})`,
      );
    } catch (error) {
      this.logger.error(`Error processing grievance submitted event: ${error.message}`, error.stack);
    }
  }

  @EventPattern(UrbanEventTopics.GRIEVANCE_RESOLVED)
  async handleGrievanceResolved(@Payload() data: GrievanceResolvedEvent) {
    this.logger.log(`Received grievance resolved event: ${JSON.stringify(data)}`);

    try {
      this.logger.log(
        `Grievance resolution notification for user ${data.userId}: ` +
          `Grievance ${data.grievanceId} resolved by ${data.resolvedBy}`,
      );
    } catch (error) {
      this.logger.error(`Error processing grievance resolved event: ${error.message}`, error.stack);
    }
  }
}
