export interface Hospital {
  id: string;
  name: string;
  description?: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  facilities: string[];
  type: 'government' | 'private';
  contactNumber?: string;
  email?: string;
  isActive: boolean;
  totalBeds: number;
  availableBeds: number;
  createdAt: string;
  updatedAt: string;
  doctors?: Doctor[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: Specialization;
  qualification: string;
  experienceYears: number;
  registrationNumber: string;
  contactNumber?: string;
  email?: string;
  consultationFee: number;
  isAvailable: boolean;
  hospitalId: string;
  hospital?: Hospital;
  timeSlots?: TimeSlot[];
  createdAt: string;
}

export type Specialization =
  | 'general_medicine' | 'pediatrics' | 'cardiology' | 'orthopedics'
  | 'dermatology' | 'gynecology' | 'neurology' | 'ophthalmology'
  | 'ent' | 'psychiatry' | 'dental' | 'other';

export interface TimeSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  maxPatients: number;
  isAvailable: boolean;
  doctorId: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  hospitalId: string;
  patientName: string;
  patientMobile: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  symptoms?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  doctor?: Doctor;
  hospital?: Hospital;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface BookAppointmentDTO {
  doctorId: string;
  hospitalId: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  patientMobile: string;
  symptoms?: string;
  notes?: string;
}

export const SPECIALIZATION_LABELS: Record<Specialization, string> = {
  general_medicine: 'General Medicine',
  pediatrics: 'Pediatrics',
  cardiology: 'Cardiology',
  orthopedics: 'Orthopedics',
  dermatology: 'Dermatology',
  gynecology: 'Gynecology',
  neurology: 'Neurology',
  ophthalmology: 'Ophthalmology',
  ent: 'ENT',
  psychiatry: 'Psychiatry',
  dental: 'Dental',
  other: 'Other',
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
};
