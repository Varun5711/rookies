# Ingenium Platform - Complete Postman Testing Flow

> Comprehensive end-to-end API testing guide with all endpoints from deep code analysis

---

## Table of Contents

1. [Setup & Configuration](#1-setup--configuration)
2. [API Response Format](#2-api-response-format)
3. [Gateway & Health Checks](#3-gateway--health-checks)
4. [Authentication Service](#4-authentication-service)
5. [Service Registry](#5-service-registry)
6. [Healthcare Service - Complete API](#6-healthcare-service---complete-api)
7. [Agriculture Service - Complete API](#7-agriculture-service---complete-api)
8. [Urban Service - Complete API](#8-urban-service---complete-api)
9. [Dynamic Service Demo](#9-dynamic-service-demo)
10. [Complete Test Execution Order](#10-complete-test-execution-order)
11. [Postman Collection Structure](#11-postman-collection-structure)

---

## 1. Setup & Configuration

### 1.1 Import Collection
1. Open Postman
2. **Import** → Select `ingenium-api.postman_collection.json`

### 1.2 Create Environment: `Ingenium Local`

| Variable | Value | Description |
|----------|-------|-------------|
| `gateway_url` | `http://localhost:3000/api` | API Gateway |
| `registry_url` | `http://localhost:3002/api` | Service Registry direct |
| `access_token` | *(empty)* | Auto-saved on login |
| `refresh_token` | *(empty)* | Auto-saved on login |
| `hospital_id` | *(empty)* | Saved from list hospitals |
| `doctor_id` | *(empty)* | Saved from list doctors |
| `slot_id` | *(empty)* | Saved from doctor slots |
| `appointment_id` | *(empty)* | Saved on booking |
| `scheme_id` | *(empty)* | Saved from list schemes |
| `application_id` | *(empty)* | Saved on apply |
| `category_id` | *(empty)* | Saved from categories |
| `grievance_id` | *(empty)* | Saved on submit |

---

## 2. API Response Format

### Success Response (Gateway wrapped)
```json
{
  "success": true,
  "data": { /* payload */ },
  "meta": {
    "timestamp": "2026-01-17T16:30:00.000Z",
    "requestId": "correlation-id"
  }
}
```

### Paginated Response (from services)
```json
{
  "data": [ /* items */ ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description"
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

---

## 3. Gateway & Health Checks

### 3.1 Gateway Root Info

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}` |

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "DPI Platform API Gateway",
    "version": "1.0.0",
    "documentation": "/api/docs"
  }
}
```

---

### 3.2 Gateway Health

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/health` |

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "api-gateway",
    "timestamp": "2026-01-17T16:30:00.000Z"
  }
}
```

---

## 4. Authentication Service

### 4.1 Send OTP

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{gateway_url}}/auth/otp/send` |
| **Headers** | `Content-Type: application/json` |

**Body:**
```json
{
  "mobile": "+919876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "OTP sent successfully",
    "expiresIn": 300
  }
}
```

---

### 4.2 Verify OTP

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{gateway_url}}/auth/otp/verify` |
| **Headers** | `Content-Type: application/json` |

**Body:**
```json
{
  "mobile": "+919876543210",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "OTP verified successfully",
    "user": {
      "id": "uuid",
      "mobile": "+919876543210",
      "fullName": "User",
      "mobileVerified": true,
      "roles": ["citizen"]
    },
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG...",
      "expiresIn": "15m"
    }
  }
}
```

**Test Script:**
```javascript
if (pm.response.code === 200) {
    var json = pm.response.json();
    if (json.data && json.data.tokens) {
        pm.environment.set('access_token', json.data.tokens.accessToken);
        pm.environment.set('refresh_token', json.data.tokens.refreshToken);
    }
}
```

---

### 4.3 Google OAuth - Initiate

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/auth/google/login` |

> Opens browser, redirects to Google. After consent, redirects to callback with tokens.

---

### 4.4 Refresh Token

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{gateway_url}}/auth/tokens/refresh` |
| **Headers** | `Content-Type: application/json` |

**Body:**
```json
{
  "refreshToken": "{{refresh_token}}"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Tokens refreshed successfully",
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG..."
    }
  }
}
```

---

### 4.5 Logout

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{gateway_url}}/auth/tokens/logout` |
| **Headers** | `Content-Type: application/json` |

**Body:**
```json
{
  "refreshToken": "{{refresh_token}}"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Logged out successfully"
  }
}
```

---

## 5. Service Registry

### 5.1 Register Service

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{registry_url}}/registry/services` |
| **Headers** | `Content-Type: application/json` |

**Body (Full):**
```json
{
  "name": "healthcare",
  "displayName": "Healthcare Services",
  "description": "Hospital and appointment management",
  "baseUrl": "http://localhost:3010",
  "healthEndpoint": "/api/health",
  "version": "1.0.0",
  "owner": "health-ministry",
  "tags": ["healthcare", "hospitals", "appointments"],
  "isPublic": false,
  "requiredRoles": ["citizen"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Service registered successfully",
  "service": {
    "id": "uuid",
    "name": "healthcare",
    "displayName": "Healthcare Services",
    "baseUrl": "http://localhost:3010",
    "status": "ACTIVE",
    "healthStatus": "HEALTHY"
  }
}
```

---

### 5.2 List All Services

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{registry_url}}/registry/services` |

**Response:**
```json
{
  "success": true,
  "count": 3,
  "services": [
    {
      "id": "uuid",
      "name": "healthcare",
      "displayName": "Healthcare Services",
      "description": "Hospital and appointment management",
      "baseUrl": "http://localhost:3010",
      "healthEndpoint": "/api/health",
      "status": "ACTIVE",
      "healthStatus": "HEALTHY",
      "version": "1.0.0",
      "owner": "health-ministry",
      "tags": ["healthcare", "hospitals", "appointments"],
      "isPublic": false,
      "requiredRoles": ["citizen"],
      "lastHealthCheck": "2026-01-17T16:25:00.000Z",
      "createdAt": "2026-01-17T10:00:00.000Z",
      "updatedAt": "2026-01-17T16:25:00.000Z"
    }
  ]
}
```

---

### 5.3 Get Service by Name

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{registry_url}}/registry/services/healthcare` |

---

### 5.4 Update Service

| Field | Value |
|-------|-------|
| **Method** | `PUT` |
| **URL** | `{{registry_url}}/registry/services/healthcare` |
| **Headers** | `Content-Type: application/json` |

**Body:**
```json
{
  "description": "Updated description",
  "isPublic": true
}
```

---

### 5.5 Update Service Status

| Field | Value |
|-------|-------|
| **Method** | `PUT` |
| **URL** | `{{registry_url}}/registry/services/healthcare/status` |
| **Headers** | `Content-Type: application/json` |

**Body:**
```json
{
  "status": "MAINTENANCE"
}
```

---

### 5.6 Platform Health

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{registry_url}}/registry/health` |

**Response:**
```json
{
  "success": true,
  "platformHealth": {
    "status": "HEALTHY",
    "totalServices": 3,
    "healthyServices": 3,
    "unhealthyServices": 0,
    "services": [
      { "name": "healthcare", "status": "HEALTHY" },
      { "name": "agriculture", "status": "HEALTHY" },
      { "name": "urban", "status": "HEALTHY" }
    ]
  }
}
```

---

### 5.7 Delete Service

| Field | Value |
|-------|-------|
| **Method** | `DELETE` |
| **URL** | `{{registry_url}}/registry/services/service-name` |

---

## 6. Healthcare Service - Complete API

> **Base Path**: `{{gateway_url}}/services/healthcare`  
> **Auth Required**: Yes (unless `@Public`)

### 6.1 Health Check

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/healthcare/health` |
| **Auth** | Not required (Public) |

**Response:**
```json
{
  "status": "healthy",
  "service": "healthcare-svc",
  "timestamp": "2026-01-17T16:30:00.000Z",
  "uptime": 3600.5
}
```

---

### 6.2 List Hospitals

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/healthcare/hospitals` |
| **Auth** | Not required (Public) |
| **Query Params** | `city`, `state`, `pincode`, `type`, `search`, `page`, `limit` |

**Example with filters:**
```
{{gateway_url}}/services/healthcare/hospitals?city=Bangalore&type=government&page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": "h1-uuid",
      "name": "City General Hospital",
      "description": "Multi-specialty government hospital",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001",
      "address": "MG Road, Bangalore",
      "facilities": ["Emergency", "ICU", "Pharmacy", "Lab"],
      "type": "government",
      "contactNumber": "+91-80-12345678",
      "email": "info@citygeneral.gov.in",
      "isActive": true,
      "totalBeds": 500,
      "availableBeds": 120,
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-17T16:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Test Script:**
```javascript
var json = pm.response.json();
if (json.data && json.data.length > 0) {
    pm.environment.set('hospital_id', json.data[0].id);
}
```

---

### 6.3 Get Hospital by ID

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/healthcare/hospitals/{{hospital_id}}` |
| **Auth** | Not required (Public) |

**Response includes doctors:**
```json
{
  "id": "h1-uuid",
  "name": "City General Hospital",
  "city": "Bangalore",
  "state": "Karnataka",
  "facilities": ["Emergency", "ICU", "Pharmacy", "Lab"],
  "type": "government",
  "totalBeds": 500,
  "availableBeds": 120,
  "doctors": [
    {
      "id": "d1-uuid",
      "name": "Dr. Sharma",
      "specialization": "cardiology"
    }
  ]
}
```

---

### 6.4 Create Hospital (Admin)

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{gateway_url}}/services/healthcare/hospitals` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

**Body:**
```json
{
  "name": "City General Hospital",
  "description": "Multi-specialty government hospital",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "address": "MG Road, Bangalore",
  "facilities": ["Emergency", "ICU", "Pharmacy", "Lab"],
  "type": "government",
  "contactNumber": "+91-80-12345678",
  "email": "info@citygeneral.gov.in",
  "isActive": true,
  "totalBeds": 500,
  "availableBeds": 120
}
```

---

### 6.5 Update Hospital

| Field | Value |
|-------|-------|
| **Method** | `PUT` |
| **URL** | `{{gateway_url}}/services/healthcare/hospitals/{{hospital_id}}` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

**Body (partial update):**
```json
{
  "availableBeds": 115,
  "facilities": ["Emergency", "ICU", "Pharmacy", "Lab", "MRI"]
}
```

---

### 6.6 Delete Hospital

| Field | Value |
|-------|-------|
| **Method** | `DELETE` |
| **URL** | `{{gateway_url}}/services/healthcare/hospitals/{{hospital_id}}` |
| **Headers** | `Authorization: Bearer {{access_token}}` |

---

### 6.7 List Doctors

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/healthcare/doctors` |
| **Auth** | Not required (Public) |
| **Query Params** | `hospitalId`, `specialization`, `search`, `page`, `limit` |

**Specialization Enum Values:**
- `general_medicine`, `pediatrics`, `cardiology`, `orthopedics`, `dermatology`
- `gynecology`, `neurology`, `ophthalmology`, `ent`, `psychiatry`, `dental`, `other`

**Example:**
```
{{gateway_url}}/services/healthcare/doctors?specialization=cardiology&hospitalId={{hospital_id}}
```

**Response:**
```json
{
  "data": [
    {
      "id": "d1-uuid",
      "name": "Dr. Sharma",
      "specialization": "cardiology",
      "qualification": "MBBS, MD, DM (Cardiology)",
      "experienceYears": 15,
      "registrationNumber": "KMC-12345",
      "contactNumber": "+91-9876543210",
      "email": "dr.sharma@hospital.gov.in",
      "consultationFee": 500.00,
      "isAvailable": true,
      "hospitalId": "h1-uuid",
      "hospital": {
        "id": "h1-uuid",
        "name": "City General Hospital"
      },
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

**Test Script:**
```javascript
var json = pm.response.json();
if (json.data && json.data.length > 0) {
    pm.environment.set('doctor_id', json.data[0].id);
}
```

---

### 6.8 Get Doctor by ID

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/healthcare/doctors/{{doctor_id}}` |

**Response includes hospital and timeSlots:**
```json
{
  "id": "d1-uuid",
  "name": "Dr. Sharma",
  "specialization": "cardiology",
  "hospital": { "id": "h1-uuid", "name": "City General Hospital" },
  "timeSlots": [
    {
      "id": "s1-uuid",
      "dayOfWeek": "monday",
      "startTime": "09:00",
      "endTime": "13:00",
      "slotDurationMinutes": 15,
      "maxPatients": 20,
      "isAvailable": true
    }
  ]
}
```

---

### 6.9 Create Doctor (Admin)

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{gateway_url}}/services/healthcare/doctors` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

**Body:**
```json
{
  "name": "Dr. Priya Singh",
  "specialization": "pediatrics",
  "qualification": "MBBS, MD (Pediatrics)",
  "experienceYears": 10,
  "registrationNumber": "KMC-23456",
  "contactNumber": "+91-9876543211",
  "email": "dr.priya@hospital.gov.in",
  "consultationFee": 400.00,
  "isAvailable": true,
  "hospitalId": "{{hospital_id}}"
}
```

---

### 6.10 Update Doctor

| Field | Value |
|-------|-------|
| **Method** | `PUT` |
| **URL** | `{{gateway_url}}/services/healthcare/doctors/{{doctor_id}}` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

---

### 6.11 Delete Doctor

| Field | Value |
|-------|-------|
| **Method** | `DELETE` |
| **URL** | `{{gateway_url}}/services/healthcare/doctors/{{doctor_id}}` |
| **Headers** | `Authorization: Bearer {{access_token}}` |

---

### 6.12 Get Doctor Time Slots

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/healthcare/doctors/{{doctor_id}}/slots` |
| **Auth** | Not required (Public) |

**Response:**
```json
[
  {
    "id": "s1-uuid",
    "dayOfWeek": "monday",
    "startTime": "09:00",
    "endTime": "13:00",
    "slotDurationMinutes": 15,
    "maxPatients": 20,
    "isAvailable": true,
    "doctorId": "d1-uuid"
  },
  {
    "id": "s2-uuid",
    "dayOfWeek": "wednesday",
    "startTime": "14:00",
    "endTime": "18:00",
    "slotDurationMinutes": 15,
    "maxPatients": 20,
    "isAvailable": true,
    "doctorId": "d1-uuid"
  }
]
```

**Test Script:**
```javascript
var json = pm.response.json();
if (json && json.length > 0) {
    pm.environment.set('slot_id', json[0].id);
}
```

---

### 6.13 Create Time Slot (Admin)

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{gateway_url}}/services/healthcare/doctors/{{doctor_id}}/slots` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

**Body:**
```json
{
  "dayOfWeek": "friday",
  "startTime": "09:00",
  "endTime": "12:00",
  "slotDurationMinutes": 15,
  "maxPatients": 15,
  "isAvailable": true
}
```

**DayOfWeek Enum:** `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`

---

### 6.14 Update Time Slot

| Field | Value |
|-------|-------|
| **Method** | `PUT` |
| **URL** | `{{gateway_url}}/services/healthcare/doctors/slots/{{slot_id}}` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

**Body:**
```json
{
  "isAvailable": false
}
```

---

### 6.15 Delete Time Slot

| Field | Value |
|-------|-------|
| **Method** | `DELETE` |
| **URL** | `{{gateway_url}}/services/healthcare/doctors/slots/{{slot_id}}` |
| **Headers** | `Authorization: Bearer {{access_token}}` |

---

### 6.16 List All Appointments

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/healthcare/appointments` |
| **Headers** | `Authorization: Bearer {{access_token}}` |
| **Query Params** | `doctorId`, `hospitalId`, `status`, `fromDate`, `toDate`, `page`, `limit` |

**Status Enum:** `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`, `no_show`

**Example:**
```
{{gateway_url}}/services/healthcare/appointments?status=confirmed&fromDate=2026-01-01&toDate=2026-01-31
```

**Response:**
```json
{
  "data": [
    {
      "id": "a1-uuid",
      "userId": "user-uuid",
      "patientName": "John Doe",
      "patientMobile": "+919876543210",
      "appointmentDate": "2026-02-15",
      "appointmentTime": "10:30",
      "status": "confirmed",
      "symptoms": "Headache and fever",
      "notes": "Previous history of migraine",
      "doctor": {
        "id": "d1-uuid",
        "name": "Dr. Sharma",
        "specialization": "cardiology"
      },
      "hospital": {
        "id": "h1-uuid",
        "name": "City General Hospital"
      },
      "createdAt": "2026-01-17T16:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 6.17 My Appointments

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/healthcare/appointments/me` |
| **Headers** | `Authorization: Bearer {{access_token}}` |
| **Query Params** | `status`, `fromDate`, `toDate`, `page`, `limit` |

---

### 6.18 Get Appointment by ID

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/healthcare/appointments/{{appointment_id}}` |
| **Headers** | `Authorization: Bearer {{access_token}}` |

---

### 6.19 Book Appointment

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{gateway_url}}/services/healthcare/appointments` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

**Body:**
```json
{
  "doctorId": "{{doctor_id}}",
  "hospitalId": "{{hospital_id}}",
  "appointmentDate": "2026-02-15",
  "appointmentTime": "10:30",
  "patientName": "John Doe",
  "patientMobile": "+919876543210",
  "symptoms": "Headache and fever for 3 days",
  "notes": "Previous history of migraine"
}
```

**Response (201):**
```json
{
  "id": "a1-uuid",
  "userId": "user-uuid",
  "doctorId": "d1-uuid",
  "hospitalId": "h1-uuid",
  "patientName": "John Doe",
  "patientMobile": "+919876543210",
  "appointmentDate": "2026-02-15",
  "appointmentTime": "10:30",
  "status": "confirmed",
  "symptoms": "Headache and fever for 3 days",
  "notes": "Previous history of migraine",
  "createdAt": "2026-01-17T16:30:00.000Z",
  "updatedAt": "2026-01-17T16:30:00.000Z"
}
```

> 📨 **Kafka Event**: `dpi.healthcare.appointment-booked`

**Test Script:**
```javascript
var json = pm.response.json();
if (json && json.id) {
    pm.environment.set('appointment_id', json.id);
}
```

---

### 6.20 Cancel Appointment

| Field | Value |
|-------|-------|
| **Method** | `PUT` |
| **URL** | `{{gateway_url}}/services/healthcare/appointments/{{appointment_id}}/cancel` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

**Body:**
```json
{
  "reason": "Schedule conflict - need to reschedule"
}
```

**Response:**
```json
{
  "id": "a1-uuid",
  "status": "cancelled",
  "cancellationReason": "Schedule conflict - need to reschedule",
  "cancelledAt": "2026-01-17T17:00:00.000Z"
}
```

> 📨 **Kafka Event**: `dpi.healthcare.appointment-cancelled`

---

## 7. Agriculture Service - Complete API

> **Base Path**: `{{gateway_url}}/services/agriculture`

### 7.1 Health Check

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/health` |
| **Auth** | Not required |

---

### 7.2 List Advisories

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/advisories` |
| **Auth** | Not required (Public) |
| **Query Params** | `state`, `season`, `category`, `cropName`, `page`, `limit` |

**Season Enum:** `kharif`, `rabi`, `zaid`, `all`

**Category Enum:** `pest_control`, `weather`, `irrigation`, `fertilizer`, `harvesting`, `sowing`, `general`

**Example:**
```
{{gateway_url}}/services/agriculture/advisories?state=Karnataka&season=kharif&category=pest_control
```

**Response:**
```json
{
  "data": [
    {
      "id": "adv-uuid",
      "title": "Rice Pest Advisory - Karnataka",
      "cropName": "Rice",
      "season": "kharif",
      "category": "pest_control",
      "state": "Karnataka",
      "district": "Mysore",
      "advisory": "Brown planthopper infestation expected. Spray recommended insecticides during evening hours.",
      "cropTypes": ["Basmati", "Sona Masuri"],
      "publishedBy": "Karnataka Agriculture Department",
      "isActive": true,
      "validFrom": "2026-01-15T00:00:00.000Z",
      "validUntil": "2026-02-15T00:00:00.000Z",
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

---

### 7.3 Get Advisory by ID

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/advisories/{id}` |
| **Auth** | Not required (Public) |

---

### 7.4 List Schemes

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/schemes` |
| **Auth** | Not required (Public) |
| **Query Params** | `category`, `isActive`, `page`, `limit` |

**Category Enum:** `subsidy`, `loan`, `insurance`, `training`, `equipment`, `other`

**Response:**
```json
{
  "data": [
    {
      "id": "sch-uuid",
      "name": "PM-KISAN",
      "description": "Pradhan Mantri Kisan Samman Nidhi - Direct income support",
      "category": "subsidy",
      "benefitAmount": 6000.00,
      "eligibilityCriteria": {
        "minLandHolding": "0 acres",
        "maxLandHolding": "No limit",
        "citizenship": "Indian"
      },
      "requiredDocuments": ["Aadhaar Card", "Land Records", "Bank Account"],
      "startDate": "2019-02-01T00:00:00.000Z",
      "endDate": null,
      "ministryName": "Ministry of Agriculture",
      "officialLink": "https://pmkisan.gov.in",
      "isActive": true,
      "totalBudget": 75000000000,
      "utilizedBudget": 50000000000,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 8, "totalPages": 1 }
}
```

**Test Script:**
```javascript
var json = pm.response.json();
if (json.data && json.data.length > 0) {
    pm.environment.set('scheme_id', json.data[0].id);
}
```

---

### 7.5 Get Scheme by ID

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/schemes/{{scheme_id}}` |
| **Auth** | Not required (Public) |

---

### 7.6 Apply for Scheme

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{gateway_url}}/services/agriculture/schemes/{{scheme_id}}/apply` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

**Body:**
```json
{
  "applicantName": "Ramesh Kumar",
  "applicantMobile": "+919876543210",
  "applicantAadhar": "1234-5678-9012",
  "formData": {
    "landSize": "2.5 acres",
    "village": "Hoskote",
    "district": "Bangalore Rural",
    "state": "Karnataka",
    "bankAccountNumber": "1234567890123456",
    "ifscCode": "SBIN0001234"
  },
  "documentUrls": [
    "https://storage.example.com/docs/aadhaar.pdf",
    "https://storage.example.com/docs/land-record.pdf"
  ]
}
```

**Response (201):**
```json
{
  "id": "app-uuid",
  "userId": "user-uuid",
  "schemeId": "sch-uuid",
  "applicantName": "Ramesh Kumar",
  "applicantMobile": "+919876543210",
  "applicantAadhar": "1234-5678-9012",
  "status": "pending",
  "formData": { ... },
  "documentUrls": [...],
  "createdAt": "2026-01-17T16:30:00.000Z"
}
```

> 📨 **Kafka Event**: `dpi.agriculture.scheme-applied`

**Test Script:**
```javascript
var json = pm.response.json();
if (json && json.id) {
    pm.environment.set('application_id', json.id);
}
```

---

### 7.7 My Applications

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/schemes/me/applications` |
| **Headers** | `Authorization: Bearer {{access_token}}` |
| **Query Params** | `status`, `page`, `limit` |

**Status Enum:** `pending`, `under_review`, `approved`, `rejected`, `disbursed`

---

### 7.8 Get Application Status

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/schemes/applications/{{application_id}}` |
| **Headers** | `Authorization: Bearer {{access_token}}` |

---

### 7.9 List Market Prices

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/market-prices` |
| **Auth** | Not required (Public) |
| **Query Params** | `commodity`, `state`, `category`, `mandi`, `page`, `limit` |

**Category Enum:** `cereals`, `pulses`, `oilseeds`, `vegetables`, `fruits`, `spices`, `fibers`, `other`

**Response:**
```json
{
  "data": [
    {
      "id": "mp-uuid",
      "commodity": "Wheat",
      "category": "cereals",
      "mandi": "Azadpur",
      "state": "Delhi",
      "district": "North Delhi",
      "minPrice": 2100.00,
      "maxPrice": 2400.00,
      "modalPrice": 2250.00,
      "priceDate": "2026-01-17",
      "unit": "quintal",
      "arrivalsTonnes": 500
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

---

### 7.10 Get Price by ID

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/market-prices/{id}` |

---

### 7.11 List Commodities

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/market-prices/commodities` |
| **Auth** | Not required (Public) |

**Response:**
```json
["Wheat", "Rice", "Onion", "Potato", "Tomato", "Cotton", "Soybean"]
```

---

### 7.12 List Mandis

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/agriculture/market-prices/mandis` |
| **Query Params** | `state` (optional) |

**Example:**
```
{{gateway_url}}/services/agriculture/market-prices/mandis?state=Maharashtra
```

---

## 8. Urban Service - Complete API

> **Base Path**: `{{gateway_url}}/services/urban`

### 8.1 Health Check

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/urban/health` |
| **Auth** | Not required |

---

### 8.2 List Categories

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/urban/categories` |
| **Auth** | Not required (Public) |

**Response:**
```json
[
  {
    "id": "cat-uuid-1",
    "name": "Water Supply",
    "description": "Issues related to water supply, leakages, contamination",
    "department": "Public Works Department",
    "departmentEmail": "pwd@city.gov.in",
    "departmentPhone": "+91-80-12345001",
    "slaDays": 7,
    "isActive": true,
    "icon": "💧"
  },
  {
    "id": "cat-uuid-2",
    "name": "Roads & Footpaths",
    "description": "Potholes, damaged roads, footpath issues",
    "department": "BBMP Engineering",
    "departmentEmail": "roads@bbmp.gov.in",
    "departmentPhone": "+91-80-12345002",
    "slaDays": 14,
    "isActive": true,
    "icon": "🛣️"
  },
  {
    "id": "cat-uuid-3",
    "name": "Garbage & Sanitation",
    "description": "Waste collection, sanitation issues",
    "department": "Sanitation Department",
    "departmentEmail": "sanitation@city.gov.in",
    "slaDays": 3,
    "isActive": true,
    "icon": "🗑️"
  },
  {
    "id": "cat-uuid-4",
    "name": "Street Lights",
    "description": "Non-functional street lights",
    "department": "Electrical Department",
    "slaDays": 5,
    "isActive": true,
    "icon": "💡"
  },
  {
    "id": "cat-uuid-5",
    "name": "Drainage & Sewage",
    "description": "Blocked drains, sewage overflow",
    "department": "Drainage Department",
    "slaDays": 2,
    "isActive": true,
    "icon": "🚿"
  }
]
```

**Test Script:**
```javascript
var json = pm.response.json();
if (json && json.length > 0) {
    pm.environment.set('category_id', json[0].id);
}
```

---

### 8.3 Get Category by ID

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/urban/categories/{{category_id}}` |
| **Auth** | Not required (Public) |

---

### 8.4 List All Grievances

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/urban/grievances` |
| **Headers** | `Authorization: Bearer {{access_token}}` |
| **Query Params** | `categoryId`, `status`, `priority`, `fromDate`, `toDate`, `page`, `limit` |

**Status Enum:** `submitted`, `acknowledged`, `in_progress`, `pending_info`, `escalated`, `resolved`, `closed`, `rejected`

**Priority Enum:** `low`, `medium`, `high`, `urgent`

---

### 8.5 My Grievances

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/urban/grievances/me` |
| **Headers** | `Authorization: Bearer {{access_token}}` |
| **Query Params** | `status`, `priority`, `page`, `limit` |

**Response:**
```json
{
  "data": [
    {
      "id": "grv-uuid",
      "title": "Large pothole on MG Road",
      "description": "There is a large pothole near City Mall...",
      "status": "in_progress",
      "priority": "high",
      "location": "MG Road, near City Mall",
      "dueDate": "2026-01-31T16:30:00.000Z",
      "createdAt": "2026-01-17T16:30:00.000Z",
      "category": {
        "id": "cat-uuid",
        "name": "Roads & Footpaths",
        "department": "BBMP Engineering"
      }
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 }
}
```

---

### 8.6 Get Grievance by ID

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/urban/grievances/{{grievance_id}}` |
| **Headers** | `Authorization: Bearer {{access_token}}` |

---

### 8.7 Submit Grievance

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `{{gateway_url}}/services/urban/grievances` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

**Body:**
```json
{
  "categoryId": "{{category_id}}",
  "title": "Large pothole on MG Road",
  "description": "There is a large pothole near City Mall junction causing accidents. Multiple vehicles have been damaged in the past week.",
  "complainantName": "Suresh Kumar",
  "complainantMobile": "+919876543210",
  "complainantEmail": "suresh@example.com",
  "location": "MG Road, near City Mall",
  "address": "MG Road, Opposite City Mall, Bangalore",
  "ward": "Ward 12",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "priority": "high",
  "attachments": [
    "https://storage.example.com/images/pothole1.jpg",
    "https://storage.example.com/images/pothole2.jpg"
  ]
}
```

**Response (201):**
```json
{
  "id": "grv-uuid",
  "userId": "user-uuid",
  "categoryId": "cat-uuid",
  "title": "Large pothole on MG Road",
  "description": "There is a large pothole near City Mall junction...",
  "complainantName": "Suresh Kumar",
  "complainantMobile": "+919876543210",
  "complainantEmail": "suresh@example.com",
  "location": "MG Road, near City Mall",
  "address": "MG Road, Opposite City Mall, Bangalore",
  "ward": "Ward 12",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "status": "submitted",
  "priority": "high",
  "attachments": [...],
  "dueDate": "2026-01-31T16:30:00.000Z",
  "createdAt": "2026-01-17T16:30:00.000Z",
  "category": {
    "id": "cat-uuid",
    "name": "Roads & Footpaths",
    "department": "BBMP Engineering"
  }
}
```

> 📨 **Kafka Event**: `dpi.urban.grievance-submitted`

**Test Script:**
```javascript
var json = pm.response.json();
if (json && json.id) {
    pm.environment.set('grievance_id', json.id);
}
```

---

### 8.8 Get Grievance Status

| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `{{gateway_url}}/services/urban/grievances/{{grievance_id}}/status` |
| **Headers** | `Authorization: Bearer {{access_token}}` |

**Response:**
```json
{
  "id": "grv-uuid",
  "title": "Large pothole on MG Road",
  "status": "in_progress",
  "priority": "high",
  "assignedTo": "Field Engineer - Zone 3",
  "assignedDepartment": "BBMP Engineering",
  "dueDate": "2026-01-31T16:30:00.000Z",
  "createdAt": "2026-01-17T16:30:00.000Z",
  "updatedAt": "2026-01-18T10:00:00.000Z"
}
```

---

### 8.9 Escalate Grievance

| Field | Value |
|-------|-------|
| **Method** | `PUT` |
| **URL** | `{{gateway_url}}/services/urban/grievances/{{grievance_id}}/escalate` |
| **Headers** | `Authorization: Bearer {{access_token}}`, `Content-Type: application/json` |

**Body:**
```json
{
  "reason": "No action taken for 7 days despite being marked urgent"
}
```

**Response:**
```json
{
  "id": "grv-uuid",
  "status": "escalated",
  "escalationReason": "No action taken for 7 days despite being marked urgent",
  "escalatedAt": "2026-01-24T16:30:00.000Z"
}
```

---

## 9. Dynamic Service Demo

### 9.1 Register New Service

```
POST {{registry_url}}/registry/services
```

**Body:**
```json
{
  "name": "education",
  "displayName": "Education Services",
  "description": "Course catalog, enrollment, certificates",
  "baseUrl": "http://localhost:3013",
  "healthEndpoint": "/api/health",
  "version": "1.0.0",
  "owner": "education-ministry",
  "tags": ["education", "courses"],
  "isPublic": false,
  "requiredRoles": ["citizen"]
}
```

### 9.2 Access via Gateway

```
GET {{gateway_url}}/services/education/courses
Authorization: Bearer {{access_token}}
```

✅ **No gateway restart needed**  
✅ **No code changes required**

---

## 10. Complete Test Execution Order

### Phase 1: Pre-Flight (3 tests)
| # | Request | Expected |
|---|---------|----------|
| 1 | Gateway Root | 200 OK |
| 2 | Gateway Health | `status: healthy` |
| 3 | Registry - List Services | 3 services |

### Phase 2: Authentication (3 tests)
| # | Request | Expected |
|---|---------|----------|
| 4 | Send OTP | `success: true` |
| 5 | Verify OTP | Tokens saved |
| 6 | Refresh Token | New tokens |

### Phase 3: Healthcare (13 tests)
| # | Request | Expected |
|---|---------|----------|
| 7 | Service Health | `status: healthy` |
| 8 | List Hospitals | Array, save `hospital_id` |
| 9 | Get Hospital | Hospital details |
| 10 | Create Hospital | 201 Created |
| 11 | List Doctors | Array, save `doctor_id` |
| 12 | Get Doctor | Doctor details |
| 13 | Create Doctor | 201 Created |
| 14 | Get Doctor Slots | Array, save `slot_id` |
| 15 | Create Time Slot | 201 Created |
| 16 | List Appointments | Array |
| 17 | Book Appointment | Save `appointment_id` |
| 18 | My Appointments | Shows appointment |
| 19 | Cancel Appointment | `status: cancelled` |

### Phase 4: Agriculture (8 tests)
| # | Request | Expected |
|---|---------|----------|
| 20 | Service Health | `status: healthy` |
| 21 | List Advisories | Array |
| 22 | List Schemes | Array, save `scheme_id` |
| 23 | Get Scheme | Scheme details |
| 24 | Apply for Scheme | Save `application_id` |
| 25 | My Applications | Shows application |
| 26 | List Market Prices | Array |
| 27 | List Commodities | Array of names |

### Phase 5: Urban (7 tests)
| # | Request | Expected |
|---|---------|----------|
| 28 | Service Health | `status: healthy` |
| 29 | List Categories | Array, save `category_id` |
| 30 | Submit Grievance | Save `grievance_id` |
| 31 | My Grievances | Shows grievance |
| 32 | Get Grievance | Grievance details |
| 33 | Get Status | Status info |
| 34 | Escalate Grievance | `status: escalated` |

### Phase 6: Extensibility (3 tests)
| # | Request | Expected |
|---|---------|----------|
| 35 | Register education service | 201 Created |
| 36 | List Services | 4 services |
| 37 | Access education via gateway | Dynamic routing works |

**Total: 37 Tests**

---

## 11. Postman Collection Structure

```
📁 Ingenium API
├── 📁 Gateway
│   ├── Gateway Info
│   └── Gateway Health
├── 📁 Authentication
│   ├── Send OTP
│   ├── Verify OTP
│   ├── Google Login
│   ├── Refresh Token
│   └── Logout
├── 📁 Service Registry
│   ├── Register Service
│   ├── List Services
│   ├── Get Service
│   ├── Update Service
│   ├── Update Status
│   ├── Platform Health
│   └── Delete Service
├── 📁 Healthcare Service
│   ├── Health Check
│   ├── 📁 Hospitals
│   │   ├── List Hospitals
│   │   ├── Get Hospital
│   │   ├── Create Hospital
│   │   ├── Update Hospital
│   │   └── Delete Hospital
│   ├── 📁 Doctors
│   │   ├── List Doctors
│   │   ├── Get Doctor
│   │   ├── Create Doctor
│   │   ├── Update Doctor
│   │   ├── Delete Doctor
│   │   ├── Get Slots
│   │   ├── Create Slot
│   │   ├── Update Slot
│   │   └── Delete Slot
│   └── 📁 Appointments
│       ├── List All
│       ├── My Appointments
│       ├── Get Appointment
│       ├── Book Appointment
│       └── Cancel Appointment
├── 📁 Agriculture Service
│   ├── Health Check
│   ├── 📁 Advisories
│   │   ├── List Advisories
│   │   └── Get Advisory
│   ├── 📁 Schemes
│   │   ├── List Schemes
│   │   ├── Get Scheme
│   │   ├── Apply for Scheme
│   │   ├── My Applications
│   │   └── Get Application
│   └── 📁 Market Prices
│       ├── List Prices
│       ├── Get Price
│       ├── List Commodities
│       └── List Mandis
├── 📁 Urban Service
│   ├── Health Check
│   ├── 📁 Categories
│   │   ├── List Categories
│   │   └── Get Category
│   └── 📁 Grievances
│       ├── List Grievances
│       ├── My Grievances
│       ├── Get Grievance
│       ├── Submit Grievance
│       ├── Get Status
│       └── Escalate
└── 📁 Dynamic Service Demo
    ├── Register New Service
    └── Access via Gateway
```

---

*Document Version: 2.0 (Complete Analysis)*  
*Last Updated: January 17, 2026*