# BharatSetu DPI Platform - Production-Grade Frontend Development Plan

> **Comprehensive step-by-step guide for Claude Code to build end-to-end frontend**

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Setup](#2-tech-stack--setup)
3. [Folder Structure](#3-folder-structure)
4. [Phase 1: Foundation](#4-phase-1-foundation)
5. [Phase 2: Authentication](#5-phase-2-authentication)
6. [Phase 3: Dashboard Layouts](#6-phase-3-dashboard-layouts)
7. [Phase 4: Healthcare Module](#7-phase-4-healthcare-module)
8. [Phase 5: Agriculture Module](#8-phase-5-agriculture-module)
9. [Phase 6: Urban Module](#9-phase-6-urban-module)
10. [Phase 7: Admin Panel](#10-phase-7-admin-panel)
11. [Phase 8: Shared Features](#11-phase-8-shared-features)
12. [API Routes Reference](#12-api-routes-reference)
13. [Testing & Verification](#13-testing--verification)

---

## 1. Project Overview

### Platform Description
**BharatSetu** is a Digital Public Infrastructure (DPI) platform that serves as a unified portal for government services. The backend is already built using NestJS microservices architecture.

### Backend Services Available
| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 3000 | Entry point, dynamic routing |
| Auth Service | 3001 | OAuth 2.0 + Mobile OTP |
| Service Registry | 3002 | Service discovery |
| Healthcare | 3003 | Hospitals, doctors, appointments |
| Agriculture | 3004 | Schemes, advisories, market prices |
| Urban | 3005 | Grievances, civic services |
| Notification | 3006 | SMS, email, push |
| Audit | 3007 | Event logging |

### Frontend Base URL
```
API Gateway: http://localhost:3000/api
```

---

## 2. Tech Stack & Setup

### Existing Setup (Do NOT Change)
The frontend is already initialized at `dpi-client/` with:
- **Framework**: Next.js 16.1.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React
- **Package Manager**: Bun

### Required Additional Dependencies
Install the following packages:

```bash
cd dpi-client
bun add axios react-hook-form zod @hookform/resolvers zustand react-query @tanstack/react-query date-fns react-hot-toast
bun add -D @types/node
```

| Package | Purpose |
|---------|---------|
| `axios` | HTTP client for API calls |
| `react-hook-form` + `zod` | Form validation |
| `zustand` | Lightweight state management |
| `@tanstack/react-query` | Server state, caching |
| `date-fns` | Date formatting |
| `react-hot-toast` | Toast notifications |

---

## 3. Folder Structure

Reorganize `dpi-client/app/` to follow this structure:

```
dpi-client/
├── app/
│   ├── (auth)/                    # Auth layout group
│   │   ├── login/page.tsx
│   │   ├── verify-otp/page.tsx
│   │   └── layout.tsx
│   ├── (citizen)/                 # Citizen portal layout
│   │   ├── dashboard/page.tsx
│   │   ├── healthcare/
│   │   │   ├── page.tsx           # List hospitals
│   │   │   ├── hospitals/[id]/page.tsx
│   │   │   ├── doctors/page.tsx
│   │   │   ├── doctors/[id]/page.tsx
│   │   │   ├── appointments/page.tsx
│   │   │   └── appointments/book/page.tsx
│   │   ├── agriculture/
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── schemes/page.tsx
│   │   │   ├── schemes/[id]/page.tsx
│   │   │   ├── schemes/[id]/apply/page.tsx
│   │   │   ├── advisories/page.tsx
│   │   │   ├── market-prices/page.tsx
│   │   │   └── my-applications/page.tsx
│   │   ├── urban/
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── grievances/page.tsx
│   │   │   ├── grievances/new/page.tsx
│   │   │   ├── grievances/[id]/page.tsx
│   │   │   └── categories/page.tsx
│   │   ├── profile/page.tsx
│   │   └── layout.tsx
│   ├── (admin)/                   # Admin portal layout
│   │   ├── dashboard/page.tsx
│   │   ├── services/page.tsx
│   │   ├── healthcare/
│   │   │   ├── hospitals/page.tsx
│   │   │   ├── hospitals/new/page.tsx
│   │   │   ├── doctors/page.tsx
│   │   │   └── appointments/page.tsx
│   │   ├── agriculture/
│   │   │   ├── schemes/page.tsx
│   │   │   ├── advisories/page.tsx
│   │   │   └── market-prices/page.tsx
│   │   ├── urban/
│   │   │   ├── grievances/page.tsx
│   │   │   └── categories/page.tsx
│   │   ├── users/page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page (keep existing)
│   └── globals.css
├── components/
│   ├── ui/                        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Pagination.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── CitizenLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── OTPForm.tsx
│   │   └── GoogleAuthButton.tsx
│   ├── healthcare/
│   │   ├── HospitalCard.tsx
│   │   ├── DoctorCard.tsx
│   │   ├── AppointmentCard.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   └── BookingForm.tsx
│   ├── agriculture/
│   │   ├── SchemeCard.tsx
│   │   ├── AdvisoryCard.tsx
│   │   ├── MarketPriceTable.tsx
│   │   └── ApplicationForm.tsx
│   └── urban/
│       ├── CategoryCard.tsx
│       ├── GrievanceCard.tsx
│       ├── GrievanceForm.tsx
│       └── StatusTimeline.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts              # Axios instance
│   │   ├── auth.ts                # Auth API calls
│   │   ├── healthcare.ts          # Healthcare API calls
│   │   ├── agriculture.ts         # Agriculture API calls
│   │   ├── urban.ts               # Urban API calls
│   │   └── admin.ts               # Admin API calls
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useHospitals.ts
│   │   ├── useDoctors.ts
│   │   ├── useAppointments.ts
│   │   ├── useSchemes.ts
│   │   ├── useGrievances.ts
│   │   └── usePagination.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── utils/
│   │   ├── formatDate.ts
│   │   ├── formatCurrency.ts
│   │   └── validators.ts
│   └── types/
│       ├── auth.ts
│       ├── healthcare.ts
│       ├── agriculture.ts
│       ├── urban.ts
│       └── common.ts
├── public/
│   ├── images/
│   └── icons/
└── middleware.ts                   # Auth middleware
```

---

## 4. Phase 1: Foundation

### Step 1.1: Create API Client

Create `lib/api/client.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${API_BASE_URL}/auth/tokens/refresh`, {
          refreshToken,
        });
        
        localStorage.setItem('access_token', data.data.tokens.accessToken);
        localStorage.setItem('refresh_token', data.data.tokens.refreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${data.data.tokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 1.2: Create Type Definitions

Create `lib/types/common.ts`:

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
```

Create `lib/types/auth.ts`:

```typescript
export interface User {
  id: string;
  mobile?: string;
  email?: string;
  fullName: string;
  mobileVerified: boolean;
  roles: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: AuthTokens;
}
```

Create `lib/types/healthcare.ts`:

```typescript
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
```

Create `lib/types/agriculture.ts`:

```typescript
export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: SchemeCategory;
  benefitAmount: number;
  eligibilityCriteria: Record<string, string>;
  requiredDocuments: string[];
  startDate: string;
  endDate?: string;
  ministryName: string;
  officialLink?: string;
  isActive: boolean;
  totalBudget: number;
  utilizedBudget: number;
  createdAt: string;
}

export type SchemeCategory = 'subsidy' | 'loan' | 'insurance' | 'training' | 'equipment' | 'other';

export interface SchemeApplication {
  id: string;
  userId: string;
  schemeId: string;
  applicantName: string;
  applicantMobile: string;
  applicantAadhar: string;
  status: ApplicationStatus;
  formData: Record<string, string>;
  documentUrls: string[];
  scheme?: Scheme;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed';

export interface Advisory {
  id: string;
  title: string;
  cropName: string;
  season: Season;
  category: AdvisoryCategory;
  state: string;
  district?: string;
  advisory: string;
  cropTypes: string[];
  publishedBy: string;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  createdAt: string;
}

export type Season = 'kharif' | 'rabi' | 'zaid' | 'all';
export type AdvisoryCategory = 'pest_control' | 'weather' | 'irrigation' | 'fertilizer' | 'harvesting' | 'sowing' | 'general';

export interface MarketPrice {
  id: string;
  commodity: string;
  category: CommodityCategory;
  mandi: string;
  state: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  unit: string;
  arrivalsTonnes: number;
}

export type CommodityCategory = 'cereals' | 'pulses' | 'oilseeds' | 'vegetables' | 'fruits' | 'spices' | 'fibers' | 'other';
```

Create `lib/types/urban.ts`:

```typescript
export interface Category {
  id: string;
  name: string;
  description: string;
  department: string;
  departmentEmail?: string;
  departmentPhone?: string;
  slaDays: number;
  isActive: boolean;
  icon?: string;
}

export interface Grievance {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  complainantName: string;
  complainantMobile: string;
  complainantEmail?: string;
  location: string;
  address: string;
  ward?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  status: GrievanceStatus;
  priority: Priority;
  attachments: string[];
  assignedTo?: string;
  assignedDepartment?: string;
  escalationReason?: string;
  escalatedAt?: string;
  dueDate: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export type GrievanceStatus = 'submitted' | 'acknowledged' | 'in_progress' | 'pending_info' | 'escalated' | 'resolved' | 'closed' | 'rejected';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface SubmitGrievanceDTO {
  categoryId: string;
  title: string;
  description: string;
  complainantName: string;
  complainantMobile: string;
  complainantEmail?: string;
  location: string;
  address: string;
  ward?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  priority: Priority;
  attachments?: string[];
}
```

### Step 1.3: Create Auth Store

Create `lib/store/authStore.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### Step 1.4: Create UI Components

Create reusable UI components in `components/ui/`:

> [!IMPORTANT]
> All UI components must use TailwindCSS classes and follow the existing design system from `page.tsx` (blue-700 primary, orange accents, slate grays).

**Required UI Components:**
1. `Button.tsx` - Primary, secondary, outline, danger variants
2. `Input.tsx` - Text input with label, error states
3. `Card.tsx` - Content card with header, body
4. `Modal.tsx` - Overlay modal dialog
5. `Table.tsx` - Data table with sorting
6. `Badge.tsx` - Status badges (pending, approved, etc.)
7. `Pagination.tsx` - Page navigation
8. `Skeleton.tsx` - Loading placeholders

---

## 5. Phase 2: Authentication

### Step 2.1: Create Auth API

Create `lib/api/auth.ts`:

```typescript
import apiClient from './client';
import { LoginResponse } from '../types/auth';

export const authApi = {
  sendOtp: async (mobile: string) => {
    const response = await apiClient.post('/auth/otp/send', { mobile });
    return response.data;
  },

  verifyOtp: async (mobile: string, otp: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/otp/verify', { mobile, otp });
    return response.data.data;
  },

  getGoogleLoginUrl: () => {
    return `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/tokens/refresh', { refreshToken });
    return response.data.data;
  },

  logout: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/tokens/logout', { refreshToken });
    return response.data;
  },
};
```

### Step 2.2: Create Login Page

Create `app/(auth)/login/page.tsx`:

**Requirements:**
- Mobile number input with Indian format (+91)
- OTP input (6 digits)
- Google OAuth button
- Form validation with react-hook-form + zod
- Toast notifications for success/error
- Redirect to dashboard after login

### Step 2.3: Create Auth Middleware

Create `middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/verify-otp', '/about-us'];
const adminPaths = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path is public
  if (publicPaths.some(path => pathname === path || pathname.startsWith('/login'))) {
    return NextResponse.next();
  }
  
  // Check for auth token in cookies or headers
  const token = request.cookies.get('access_token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Admin route protection (check role from JWT)
  if (adminPaths.some(path => pathname.startsWith(path))) {
    // Decode token and check for admin role
    // For now, allow through - implement JWT decode
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 6. Phase 3: Dashboard Layouts

### Step 3.1: Create Citizen Layout

Create `app/(citizen)/layout.tsx`:

**Requirements:**
- Fixed sidebar with navigation links
- Top navbar with user info, notifications
- Breadcrumbs
- Mobile responsive sidebar (hamburger menu)

**Sidebar Navigation Items:**
- Dashboard (home icon)
- Healthcare
  - Hospitals
  - Doctors
  - My Appointments
- Agriculture
  - Schemes
  - Advisories
  - Market Prices
  - My Applications
- Urban
  - Grievances
  - Submit Grievance
- Profile

### Step 3.2: Create Admin Layout

Create `app/(admin)/layout.tsx`:

**Requirements:**
- Similar to citizen layout but with admin-specific navigation
- Role-based access control
- Service health indicators

**Sidebar Navigation Items:**
- Dashboard
- Services Registry
- Healthcare (Admin)
  - Manage Hospitals
  - Manage Doctors
  - All Appointments
- Agriculture (Admin)
  - Manage Schemes
  - Manage Advisories
  - Market Prices
- Urban (Admin)
  - All Grievances
  - Categories
- Users Management

### Step 3.3: Create Citizen Dashboard

Create `app/(citizen)/dashboard/page.tsx`:

**Requirements:**
- Welcome message with user name
- Quick stats cards:
  - Active appointments
  - Pending applications
  - Open grievances
- Quick actions:
  - Book appointment
  - Apply for scheme
  - Submit grievance
- Recent activity list

---

## 7. Phase 4: Healthcare Module

### Step 4.1: Create Healthcare API

Create `lib/api/healthcare.ts`:

```typescript
import apiClient from './client';
import { Hospital, Doctor, Appointment, BookAppointmentDTO, TimeSlot } from '../types/healthcare';
import { PaginatedResponse, PaginationParams } from '../types/common';

interface HospitalFilters extends PaginationParams {
  city?: string;
  state?: string;
  type?: string;
  search?: string;
}

interface DoctorFilters extends PaginationParams {
  hospitalId?: string;
  specialization?: string;
  search?: string;
}

export const healthcareApi = {
  // Hospitals
  getHospitals: async (filters?: HospitalFilters): Promise<PaginatedResponse<Hospital>> => {
    const response = await apiClient.get('/services/healthcare/hospitals', { params: filters });
    return response.data;
  },

  getHospital: async (id: string): Promise<Hospital> => {
    const response = await apiClient.get(`/services/healthcare/hospitals/${id}`);
    return response.data;
  },

  // Doctors
  getDoctors: async (filters?: DoctorFilters): Promise<PaginatedResponse<Doctor>> => {
    const response = await apiClient.get('/services/healthcare/doctors', { params: filters });
    return response.data;
  },

  getDoctor: async (id: string): Promise<Doctor> => {
    const response = await apiClient.get(`/services/healthcare/doctors/${id}`);
    return response.data;
  },

  getDoctorSlots: async (doctorId: string): Promise<TimeSlot[]> => {
    const response = await apiClient.get(`/services/healthcare/doctors/${doctorId}/slots`);
    return response.data;
  },

  // Appointments
  getMyAppointments: async (filters?: PaginationParams): Promise<PaginatedResponse<Appointment>> => {
    const response = await apiClient.get('/services/healthcare/appointments/me', { params: filters });
    return response.data;
  },

  getAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get(`/services/healthcare/appointments/${id}`);
    return response.data;
  },

  bookAppointment: async (data: BookAppointmentDTO): Promise<Appointment> => {
    const response = await apiClient.post('/services/healthcare/appointments', data);
    return response.data;
  },

  cancelAppointment: async (id: string, reason: string): Promise<Appointment> => {
    const response = await apiClient.put(`/services/healthcare/appointments/${id}/cancel`, { reason });
    return response.data;
  },
};
```

### Step 4.2: Create Healthcare Pages

**Hospitals List Page** (`app/(citizen)/healthcare/page.tsx`):
- Search by city, state, type
- Filter pills for facilities (Emergency, ICU, etc.)
- Grid of hospital cards showing:
  - Hospital name and type (government/private)
  - Location, contact
  - Available beds badge
  - Facilities icons
  - "View Details" button

**Hospital Detail Page** (`app/(citizen)/healthcare/hospitals/[id]/page.tsx`):
- Full hospital information
- List of doctors at this hospital
- Contact information
- Map integration (optional)

**Doctors List Page** (`app/(citizen)/healthcare/doctors/page.tsx`):
- Filter by specialization
- Filter by hospital
- Doctor cards showing:
  - Name, photo placeholder
  - Specialization
  - Experience
  - Hospital name
  - Consultation fee
  - "Book Appointment" button

**Doctor Detail Page** (`app/(citizen)/healthcare/doctors/[id]/page.tsx`):
- Full doctor profile
- Available time slots calendar view
- "Book Now" button

**My Appointments Page** (`app/(citizen)/healthcare/appointments/page.tsx`):
- Tabs: Upcoming | Past | Cancelled
- Appointment cards showing:
  - Date, time
  - Doctor name, specialization
  - Hospital name
  - Status badge
  - Cancel button (for upcoming)

**Book Appointment Page** (`app/(citizen)/healthcare/appointments/book/page.tsx`):
- Multi-step form:
  1. Select hospital
  2. Select doctor
  3. Select date/time slot
  4. Enter patient details
  5. Review and confirm
- Progress indicator
- Form validation

---

## 8. Phase 5: Agriculture Module

### Step 5.1: Create Agriculture API

Create `lib/api/agriculture.ts`:

```typescript
import apiClient from './client';
import { Scheme, SchemeApplication, Advisory, MarketPrice } from '../types/agriculture';
import { PaginatedResponse, PaginationParams } from '../types/common';

export const agricultureApi = {
  // Schemes
  getSchemes: async (filters?: PaginationParams & { category?: string }): Promise<PaginatedResponse<Scheme>> => {
    const response = await apiClient.get('/services/agriculture/schemes', { params: filters });
    return response.data;
  },

  getScheme: async (id: string): Promise<Scheme> => {
    const response = await apiClient.get(`/services/agriculture/schemes/${id}`);
    return response.data;
  },

  applyForScheme: async (schemeId: string, data: any): Promise<SchemeApplication> => {
    const response = await apiClient.post(`/services/agriculture/schemes/${schemeId}/apply`, data);
    return response.data;
  },

  getMyApplications: async (filters?: PaginationParams): Promise<PaginatedResponse<SchemeApplication>> => {
    const response = await apiClient.get('/services/agriculture/schemes/me/applications', { params: filters });
    return response.data;
  },

  getApplicationStatus: async (id: string): Promise<SchemeApplication> => {
    const response = await apiClient.get(`/services/agriculture/schemes/applications/${id}`);
    return response.data;
  },

  // Advisories
  getAdvisories: async (filters?: PaginationParams & { state?: string; season?: string; category?: string }): Promise<PaginatedResponse<Advisory>> => {
    const response = await apiClient.get('/services/agriculture/advisories', { params: filters });
    return response.data;
  },

  getAdvisory: async (id: string): Promise<Advisory> => {
    const response = await apiClient.get(`/services/agriculture/advisories/${id}`);
    return response.data;
  },

  // Market Prices
  getMarketPrices: async (filters?: PaginationParams & { commodity?: string; state?: string; mandi?: string }): Promise<PaginatedResponse<MarketPrice>> => {
    const response = await apiClient.get('/services/agriculture/market-prices', { params: filters });
    return response.data;
  },

  getCommodities: async (): Promise<string[]> => {
    const response = await apiClient.get('/services/agriculture/market-prices/commodities');
    return response.data;
  },

  getMandis: async (state?: string): Promise<string[]> => {
    const response = await apiClient.get('/services/agriculture/market-prices/mandis', { params: { state } });
    return response.data;
  },
};
```

### Step 5.2: Create Agriculture Pages

**Schemes List Page** (`app/(citizen)/agriculture/schemes/page.tsx`):
- Filter by category (subsidy, loan, insurance, etc.)
- Scheme cards showing:
  - Scheme name
  - Category badge
  - Benefit amount
  - Ministry name
  - Key eligibility point
  - "Apply Now" button

**Scheme Detail Page** (`app/(citizen)/agriculture/schemes/[id]/page.tsx`):
- Full scheme description
- Eligibility criteria list
- Required documents with icons
- Benefit details
- Official links
- Apply button

**Apply for Scheme Page** (`app/(citizen)/agriculture/schemes/[id]/apply/page.tsx`):
- Application form
- Personal details
- Land/crop information
- Document upload (multi-file)
- Aadhaar, bank details
- Declaration checkbox
- Submit button

**My Applications Page** (`app/(citizen)/agriculture/my-applications/page.tsx`):
- Application cards with:
  - Scheme name
  - Application date
  - Status badge (pending, approved, disbursed, etc.)
  - Track button

**Advisories Page** (`app/(citizen)/agriculture/advisories/page.tsx`):
- Filter by state, season, category
- Advisory cards with:
  - Title
  - Crop name
  - Category icon
  - Validity period
  - Expandable content

**Market Prices Page** (`app/(citizen)/agriculture/market-prices/page.tsx`):
- Filters: commodity, state, mandi, date
- Table view showing:
  - Commodity
  - Mandi
  - Min/Max/Modal prices
  - Arrivals
  - Price date
- Price trend charts (optional)

---

## 9. Phase 6: Urban Module

### Step 6.1: Create Urban API

Create `lib/api/urban.ts`:

```typescript
import apiClient from './client';
import { Category, Grievance, SubmitGrievanceDTO } from '../types/urban';
import { PaginatedResponse, PaginationParams } from '../types/common';

export const urbanApi = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/services/urban/categories');
    return response.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/services/urban/categories/${id}`);
    return response.data;
  },

  // Grievances
  getMyGrievances: async (filters?: PaginationParams & { status?: string; priority?: string }): Promise<PaginatedResponse<Grievance>> => {
    const response = await apiClient.get('/services/urban/grievances/me', { params: filters });
    return response.data;
  },

  getGrievance: async (id: string): Promise<Grievance> => {
    const response = await apiClient.get(`/services/urban/grievances/${id}`);
    return response.data;
  },

  getGrievanceStatus: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/services/urban/grievances/${id}/status`);
    return response.data;
  },

  submitGrievance: async (data: SubmitGrievanceDTO): Promise<Grievance> => {
    const response = await apiClient.post('/services/urban/grievances', data);
    return response.data;
  },

  escalateGrievance: async (id: string, reason: string): Promise<Grievance> => {
    const response = await apiClient.put(`/services/urban/grievances/${id}/escalate`, { reason });
    return response.data;
  },
};
```

### Step 6.2: Create Urban Pages

**Categories Page** (`app/(citizen)/urban/categories/page.tsx`):
- Grid of category cards with:
  - Icon
  - Category name
  - Description
  - Department name
  - SLA days
  - "File Grievance" button

**My Grievances Page** (`app/(citizen)/urban/grievances/page.tsx`):
- Filter by status, priority
- Grievance cards showing:
  - Title
  - Category
  - Status badge with color coding
  - Priority badge
  - Due date
  - Track button

**Grievance Detail Page** (`app/(citizen)/urban/grievances/[id]/page.tsx`):
- Full grievance details
- Status timeline (submitted → acknowledged → in_progress → resolved)
- Assigned department info
- Attached images gallery
- Escalate button (if eligible)

**Submit Grievance Page** (`app/(citizen)/urban/grievances/new/page.tsx`):
- Category selector
- Title and description
- Location details:
  - Address input
  - Ward selection
  - Pincode
  - Map picker for lat/long (optional)
- Image upload (multiple)
- Priority selection
- Submit button

---

## 10. Phase 7: Admin Panel

### Step 7.1: Create Admin API

Create `lib/api/admin.ts`:

```typescript
import apiClient from './client';

export const adminApi = {
  // Healthcare Admin
  createHospital: async (data: any) => {
    const response = await apiClient.post('/services/healthcare/hospitals', data);
    return response.data;
  },

  updateHospital: async (id: string, data: any) => {
    const response = await apiClient.put(`/services/healthcare/hospitals/${id}`, data);
    return response.data;
  },

  deleteHospital: async (id: string) => {
    const response = await apiClient.delete(`/services/healthcare/hospitals/${id}`);
    return response.data;
  },

  createDoctor: async (data: any) => {
    const response = await apiClient.post('/services/healthcare/doctors', data);
    return response.data;
  },

  updateDoctor: async (id: string, data: any) => {
    const response = await apiClient.put(`/services/healthcare/doctors/${id}`, data);
    return response.data;
  },

  deleteDoctor: async (id: string) => {
    const response = await apiClient.delete(`/services/healthcare/doctors/${id}`);
    return response.data;
  },

  getAllAppointments: async (filters?: any) => {
    const response = await apiClient.get('/services/healthcare/appointments', { params: filters });
    return response.data;
  },

  // Time Slots
  createTimeSlot: async (doctorId: string, data: any) => {
    const response = await apiClient.post(`/services/healthcare/doctors/${doctorId}/slots`, data);
    return response.data;
  },

  updateTimeSlot: async (slotId: string, data: any) => {
    const response = await apiClient.put(`/services/healthcare/doctors/slots/${slotId}`, data);
    return response.data;
  },

  deleteTimeSlot: async (slotId: string) => {
    const response = await apiClient.delete(`/services/healthcare/doctors/slots/${slotId}`);
    return response.data;
  },

  // Service Registry
  getServices: async () => {
    const response = await apiClient.get('/registry/services');
    return response.data;
  },

  getPlatformHealth: async () => {
    const response = await apiClient.get('/registry/health');
    return response.data;
  },

  // Urban Admin
  getAllGrievances: async (filters?: any) => {
    const response = await apiClient.get('/services/urban/grievances', { params: filters });
    return response.data;
  },
};
```

### Step 7.2: Create Admin Pages

**Admin Dashboard** (`app/(admin)/dashboard/page.tsx`):
- Platform health overview
- Service status cards (healthy/degraded)
- Key metrics:
  - Total users
  - Active appointments today
  - Pending applications
  - Open grievances
- Recent activity logs

**Services Management** (`app/(admin)/services/page.tsx`):
- List of registered services
- Health status indicators
- Service details modal

**Hospital Management** (`app/(admin)/healthcare/hospitals/page.tsx`):
- Data table with search, filter
- Add new hospital button
- Edit/Delete actions
- Export functionality

**Doctor Management** (`app/(admin)/healthcare/doctors/page.tsx`):
- Data table with search, filter
- Add new doctor button
- Manage time slots modal
- Edit/Delete actions

**Grievance Management** (`app/(admin)/urban/grievances/page.tsx`):
- All grievances table
- Filter by status, category, date range
- Assign to department action
- Update status action

---

## 11. Phase 8: Shared Features

### Step 8.1: Profile Page

Create `app/(citizen)/profile/page.tsx`:

**Requirements:**
- User information display
- Edit profile form
- Change notification preferences
- Linked accounts (Google, mobile)
- Logout button

### Step 8.2: Error Handling

Create error boundary components:
- `app/error.tsx` - Global error handler
- `app/not-found.tsx` - 404 page
- API error toast notifications

### Step 8.3: Loading States

- Skeleton loaders for all list pages
- Button loading states
- Full-page loading spinner
- Optimistic UI updates

### Step 8.4: Notifications

- Toast notifications for actions
- Setup notification bell icon
- Notification dropdown (future: WebSocket)

---

## 12. API Routes Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/otp/send` | Send OTP to mobile | No |
| POST | `/auth/otp/verify` | Verify OTP and login | No |
| GET | `/auth/google/login` | Initiate Google OAuth | No |
| POST | `/auth/tokens/refresh` | Refresh access token | No |
| POST | `/auth/tokens/logout` | Logout user | No |

### Healthcare
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/services/healthcare/health` | Health check | No |
| GET | `/services/healthcare/hospitals` | List hospitals | No |
| GET | `/services/healthcare/hospitals/:id` | Get hospital | No |
| POST | `/services/healthcare/hospitals` | Create hospital | Admin |
| PUT | `/services/healthcare/hospitals/:id` | Update hospital | Admin |
| DELETE | `/services/healthcare/hospitals/:id` | Delete hospital | Admin |
| GET | `/services/healthcare/doctors` | List doctors | No |
| GET | `/services/healthcare/doctors/:id` | Get doctor | No |
| POST | `/services/healthcare/doctors` | Create doctor | Admin |
| PUT | `/services/healthcare/doctors/:id` | Update doctor | Admin |
| DELETE | `/services/healthcare/doctors/:id` | Delete doctor | Admin |
| GET | `/services/healthcare/doctors/:id/slots` | Get doctor slots | No |
| POST | `/services/healthcare/doctors/:id/slots` | Create slot | Admin |
| PUT | `/services/healthcare/doctors/slots/:id` | Update slot | Admin |
| DELETE | `/services/healthcare/doctors/slots/:id` | Delete slot | Admin |
| GET | `/services/healthcare/appointments` | All appointments | Admin |
| GET | `/services/healthcare/appointments/me` | My appointments | Yes |
| GET | `/services/healthcare/appointments/:id` | Get appointment | Yes |
| POST | `/services/healthcare/appointments` | Book appointment | Yes |
| PUT | `/services/healthcare/appointments/:id/cancel` | Cancel appointment | Yes |

### Agriculture
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/services/agriculture/health` | Health check | No |
| GET | `/services/agriculture/advisories` | List advisories | No |
| GET | `/services/agriculture/advisories/:id` | Get advisory | No |
| GET | `/services/agriculture/schemes` | List schemes | No |
| GET | `/services/agriculture/schemes/:id` | Get scheme | No |
| POST | `/services/agriculture/schemes/:id/apply` | Apply for scheme | Yes |
| GET | `/services/agriculture/schemes/me/applications` | My applications | Yes |
| GET | `/services/agriculture/schemes/applications/:id` | Get application | Yes |
| GET | `/services/agriculture/market-prices` | Get market prices | No |
| GET | `/services/agriculture/market-prices/:id` | Get price detail | No |
| GET | `/services/agriculture/market-prices/commodities` | List commodities | No |
| GET | `/services/agriculture/market-prices/mandis` | List mandis | No |

### Urban
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/services/urban/health` | Health check | No |
| GET | `/services/urban/categories` | List categories | No |
| GET | `/services/urban/categories/:id` | Get category | No |
| GET | `/services/urban/grievances` | All grievances | Admin |
| GET | `/services/urban/grievances/me` | My grievances | Yes |
| GET | `/services/urban/grievances/:id` | Get grievance | Yes |
| GET | `/services/urban/grievances/:id/status` | Get status | Yes |
| POST | `/services/urban/grievances` | Submit grievance | Yes |
| PUT | `/services/urban/grievances/:id/escalate` | Escalate | Yes |

### Service Registry
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/registry/services` | List all services | No |
| GET | `/registry/services/:name` | Get service | No |
| GET | `/registry/health` | Platform health | No |

---

## 13. Testing & Verification

### Step 13.1: Development Testing

1. **Start Backend Services:**
   ```bash
   cd rookies
   mprocs
   ```

2. **Start Frontend:**
   ```bash
   cd dpi-client
   bun dev
   ```

3. **Test Authentication:**
   - Send OTP to test mobile
   - Verify OTP flow works
   - Test token refresh

4. **Test Each Module:**
   - List and filter data
   - Create/submit forms
   - View details pages
   - Test pagination

### Step 13.2: Browser Testing

- Test on Chrome, Firefox, Safari
- Test mobile responsiveness
- Test offline/slow network scenarios

### Step 13.3: Accessibility

- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus states

---

## Summary of Work

### Files to Create (Priority Order)

1. **Foundation (Day 1):**
   - `lib/api/client.ts`
   - All type definitions in `lib/types/`
   - `lib/store/authStore.ts`
   - UI components in `components/ui/`

2. **Authentication (Day 2):**
   - `lib/api/auth.ts`
   - `app/(auth)/login/page.tsx`
   - `middleware.ts`

3. **Layouts (Day 3):**
   - `app/(citizen)/layout.tsx`
   - `app/(admin)/layout.tsx`
   - `components/layout/` components

4. **Healthcare Module (Day 4-5):**
   - All API functions
   - All pages
   - All components

5. **Agriculture Module (Day 6-7):**
   - All API functions
   - All pages
   - All components

6. **Urban Module (Day 8):**
   - All API functions
   - All pages
   - All components

7. **Admin Panel (Day 9-10):**
   - All admin pages
   - CRUD functionality

8. **Polish (Day 11-12):**
   - Error handling
   - Loading states
   - Testing
   - Bug fixes

---

> [!TIP]
> Start with the foundation phase and work through each phase sequentially. Each phase builds on the previous one.

> [!CAUTION]
> Do not skip setting up proper TypeScript types - they prevent runtime errors and improve developer experience.
