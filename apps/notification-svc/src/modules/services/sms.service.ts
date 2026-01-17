import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';

export interface SmsPayload {
  to: string;
  message: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private twilioClient: Twilio.Twilio | null = null;
  private fromNumber: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER', '+1234567890');

    if (accountSid && authToken) {
      this.twilioClient = Twilio.default(accountSid, authToken);
      this.logger.log('Twilio client initialized');
    } else {
      this.logger.warn('Twilio credentials not configured - SMS will be logged only');
    }
  }

  async sendSms(payload: SmsPayload): Promise<boolean> {
    const { to, message } = payload;

    // Format phone number
    const formattedTo = this.formatPhoneNumber(to);

    if (!this.twilioClient) {
      // Log the SMS for development/testing
      this.logger.log(`[SMS MOCK] To: ${formattedTo}, Message: ${message}`);
      return true;
    }

    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedTo,
      });

      this.logger.log(`SMS sent successfully. SID: ${result.sid}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`, error.stack);
      return false;
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');

    // If it's a 10-digit Indian number, add +91
    if (digits.length === 10) {
      return `+91${digits}`;
    }

    // If it already has country code
    if (digits.length > 10) {
      return `+${digits}`;
    }

    return phone;
  }

  // SMS Templates
  async sendAppointmentConfirmation(
    phone: string,
    doctorName: string,
    date: string,
    time: string,
  ): Promise<boolean> {
    const message = `Your appointment with Dr. ${doctorName} is confirmed for ${date} at ${time}. Please arrive 15 minutes early. - DPI Healthcare`;
    return this.sendSms({ to: phone, message });
  }

  async sendAppointmentCancellation(
    phone: string,
    doctorName: string,
    date: string,
  ): Promise<boolean> {
    const message = `Your appointment with Dr. ${doctorName} on ${date} has been cancelled. You can book a new appointment through the platform. - DPI Healthcare`;
    return this.sendSms({ to: phone, message });
  }

  async sendSchemeApplicationReceived(
    phone: string,
    schemeName: string,
    applicationId: string,
  ): Promise<boolean> {
    const message = `Your application for ${schemeName} (ID: ${applicationId.substring(0, 8)}) has been received. Track status at the DPI Agriculture portal. - DPI Agriculture`;
    return this.sendSms({ to: phone, message });
  }

  async sendGrievanceSubmitted(
    phone: string,
    grievanceId: string,
    category: string,
  ): Promise<boolean> {
    const message = `Your ${category} grievance (ID: ${grievanceId.substring(0, 8)}) has been submitted. You will receive updates on resolution progress. - DPI Urban`;
    return this.sendSms({ to: phone, message });
  }

  async sendGrievanceResolved(
    phone: string,
    grievanceId: string,
  ): Promise<boolean> {
    const message = `Your grievance (ID: ${grievanceId.substring(0, 8)}) has been resolved. Please rate your experience through the portal. - DPI Urban`;
    return this.sendSms({ to: phone, message });
  }
}
