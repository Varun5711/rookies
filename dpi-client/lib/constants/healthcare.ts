// Hospital Types
export const HOSPITAL_TYPES = {
  GOVERNMENT: 'government',
  PRIVATE: 'private',
  TRUST: 'trust',
} as const;

export type HospitalType = typeof HOSPITAL_TYPES[keyof typeof HOSPITAL_TYPES];

export const HOSPITAL_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: HOSPITAL_TYPES.GOVERNMENT, label: 'Government' },
  { value: HOSPITAL_TYPES.PRIVATE, label: 'Private' },
  { value: HOSPITAL_TYPES.TRUST, label: 'Trust' },
];

// Doctor Specializations
export const DOCTOR_SPECIALIZATIONS = {
  GENERAL_MEDICINE: 'general_medicine',
  PEDIATRICS: 'pediatrics',
  CARDIOLOGY: 'cardiology',
  ORTHOPEDICS: 'orthopedics',
  DERMATOLOGY: 'dermatology',
  GYNECOLOGY: 'gynecology',
  NEUROLOGY: 'neurology',
  OPHTHALMOLOGY: 'ophthalmology',
  ENT: 'ent',
  PSYCHIATRY: 'psychiatry',
  DENTAL: 'dental',
  OTHER: 'other',
} as const;

export type DoctorSpecialization = typeof DOCTOR_SPECIALIZATIONS[keyof typeof DOCTOR_SPECIALIZATIONS];

export const SPECIALIZATION_LABELS: Record<string, string> = {
  [DOCTOR_SPECIALIZATIONS.GENERAL_MEDICINE]: 'General Medicine',
  [DOCTOR_SPECIALIZATIONS.PEDIATRICS]: 'Pediatrics',
  [DOCTOR_SPECIALIZATIONS.CARDIOLOGY]: 'Cardiology',
  [DOCTOR_SPECIALIZATIONS.ORTHOPEDICS]: 'Orthopedics',
  [DOCTOR_SPECIALIZATIONS.DERMATOLOGY]: 'Dermatology',
  [DOCTOR_SPECIALIZATIONS.GYNECOLOGY]: 'Gynecology',
  [DOCTOR_SPECIALIZATIONS.NEUROLOGY]: 'Neurology',
  [DOCTOR_SPECIALIZATIONS.OPHTHALMOLOGY]: 'Ophthalmology',
  [DOCTOR_SPECIALIZATIONS.ENT]: 'ENT',
  [DOCTOR_SPECIALIZATIONS.PSYCHIATRY]: 'Psychiatry',
  [DOCTOR_SPECIALIZATIONS.DENTAL]: 'Dental',
  [DOCTOR_SPECIALIZATIONS.OTHER]: 'Other',
};

export const SPECIALIZATION_OPTIONS = [
  { value: '', label: 'All Specializations' },
  { value: DOCTOR_SPECIALIZATIONS.GENERAL_MEDICINE, label: 'General Medicine' },
  { value: DOCTOR_SPECIALIZATIONS.PEDIATRICS, label: 'Pediatrics' },
  { value: DOCTOR_SPECIALIZATIONS.CARDIOLOGY, label: 'Cardiology' },
  { value: DOCTOR_SPECIALIZATIONS.ORTHOPEDICS, label: 'Orthopedics' },
  { value: DOCTOR_SPECIALIZATIONS.DERMATOLOGY, label: 'Dermatology' },
  { value: DOCTOR_SPECIALIZATIONS.GYNECOLOGY, label: 'Gynecology' },
  { value: DOCTOR_SPECIALIZATIONS.NEUROLOGY, label: 'Neurology' },
  { value: DOCTOR_SPECIALIZATIONS.OPHTHALMOLOGY, label: 'Ophthalmology' },
  { value: DOCTOR_SPECIALIZATIONS.ENT, label: 'ENT' },
  { value: DOCTOR_SPECIALIZATIONS.PSYCHIATRY, label: 'Psychiatry' },
  { value: DOCTOR_SPECIALIZATIONS.DENTAL, label: 'Dental' },
  { value: DOCTOR_SPECIALIZATIONS.OTHER, label: 'Other' },
];
