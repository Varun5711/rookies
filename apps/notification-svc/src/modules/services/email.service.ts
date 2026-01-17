import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private isConfigured = false;

  constructor(private readonly configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    if (smtpHost) {
      this.isConfigured = true;
      this.logger.log('Email service configured');
    } else {
      this.logger.warn('SMTP not configured - emails will be logged only');
    }
  }

  async sendEmail(payload: EmailPayload): Promise<boolean> {
    const { to, subject, body } = payload;

    if (!this.isConfigured) {
      // Log the email for development/testing
      this.logger.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}, Body: ${body}`);
      return true;
    }

    try {
      // In production, implement actual email sending using nodemailer or similar
      this.logger.log(`Email sent to ${to}: ${subject}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      return false;
    }
  }

  // Email Templates
  async sendAppointmentConfirmationEmail(
    email: string,
    doctorName: string,
    hospitalName: string,
    date: string,
    time: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Appointment Confirmation - DPI Healthcare',
      body: `Your appointment with Dr. ${doctorName} at ${hospitalName} is confirmed for ${date} at ${time}. Please arrive 15 minutes early.`,
    });
  }

  async sendSchemeApplicationEmail(
    email: string,
    schemeName: string,
    applicationId: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Application Received: ${schemeName} - DPI Agriculture`,
      body: `Your application for ${schemeName} (Application ID: ${applicationId}) has been received. We will review your application and notify you of the status.`,
    });
  }

  async sendGrievanceConfirmationEmail(
    email: string,
    grievanceId: string,
    title: string,
    category: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Grievance Submitted: ${title} - DPI Urban`,
      body: `Your ${category} grievance (ID: ${grievanceId}) has been submitted successfully. Our team will review and address your concern at the earliest.`,
    });
  }
}
