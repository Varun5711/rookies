// Re-export healthcare constants
export * from './constants/healthcare';

// States for dropdown filters (acceptable hardcoding - static geographic data)
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// Default notification settings (localStorage-based until backend implements)
export const DEFAULT_NOTIFICATION_SETTINGS = [
  { id: 'appointments', label: 'Appointment Reminders', enabled: true },
  { id: 'applications', label: 'Application Status Updates', enabled: true },
  { id: 'grievances', label: 'Grievance Updates', enabled: true },
  { id: 'advisories', label: 'Crop Advisories', enabled: false },
  { id: 'marketing', label: 'News & Updates', enabled: false },
];
