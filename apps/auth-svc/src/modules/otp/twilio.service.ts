import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as twilio from 'twilio';

/**
 * Twilio Service
 * Handles Twilio Verify API integration for OTP sending and verification
 *
 * Uses Twilio Verify Service for:
 * - Automatic OTP generation (6 digits)
 * - SMS delivery
 * - OTP verification
 * - Expiration handling (5 minutes default)
 */
@Injectable()
export class TwilioService {
  private client: twilio.Twilio;
  private verifyServiceSid: string;

  constructor() {
    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID || '';

    if (!accountSid || !authToken || !this.verifyServiceSid) {
      console.warn(
        'Twilio credentials not configured. OTP functionality will not work.'
      );
    } else {
      this.client = twilio(accountSid, authToken);
    }
  }

  /**
   * Send OTP to mobile number
   * Returns verification SID for tracking
   */
  async sendOTP(mobile: string): Promise<string> {
    if (!this.client) {
      throw new InternalServerErrorException('Twilio not configured');
    }

    try {
      const verification = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({
          to: `+91${mobile}`, // Indian mobile numbers
          channel: 'sms',
        });

      console.log(`OTP sent to +91${mobile}, SID: ${verification.sid}`);
      return verification.sid;
    } catch (error) {
      console.error('Twilio send OTP error:', error.message);
      throw new InternalServerErrorException('Failed to send OTP. Please try again.');
    }
  }

  /**
   * Verify OTP
   * Returns true if OTP is valid, false otherwise
   */
  async verifyOTP(mobile: string, otp: string): Promise<boolean> {
    if (!this.client) {
      throw new InternalServerErrorException('Twilio not configured');
    }

    try {
      const verificationCheck = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          to: `+91${mobile}`,
          code: otp,
        });

      console.log(
        `OTP verification for +91${mobile}: ${verificationCheck.status}`
      );

      return verificationCheck.status === 'approved';
    } catch (error) {
      console.error('Twilio verify OTP error:', error.message);

      // If the error is due to incorrect OTP, return false instead of throwing
      if (error.code === 20404 || error.status === 404) {
        return false; // OTP not found or expired
      }

      throw new InternalServerErrorException('Failed to verify OTP. Please try again.');
    }
  }
}
