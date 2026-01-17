import { z } from 'zod';

export const mobileSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number');

export const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d+$/, 'OTP must contain only numbers');

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .optional()
  .or(z.literal(''));

export const pincodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'Pincode must be 6 digits');

export const aadharSchema = z
  .string()
  .regex(/^\d{12}$/, 'Aadhaar must be 12 digits');

export const requiredString = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`);

export const optionalString = z.string().optional().or(z.literal(''));
