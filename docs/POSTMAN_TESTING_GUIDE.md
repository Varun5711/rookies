# Ingenium DPI Platform - Complete Testing Guide

**Hackathon Demo Flow | End-to-End API Testing**

This guide provides a comprehensive testing flow for demonstrating all features of the Ingenium DPI Platform, including the newly implemented RBAC security system.

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Demo Flow Overview](#demo-flow-overview)
3. [Scenario 1: Citizen Healthcare Journey](#scenario-1-citizen-healthcare-journey)
4. [Scenario 2: RBAC Security Demonstration](#scenario-2-rbac-security-demonstration)
5. [Scenario 3: Admin Operations](#scenario-3-admin-operations)
6. [Scenario 4: Agriculture Services](#scenario-4-agriculture-services)
7. [Scenario 5: Urban Grievance System](#scenario-5-urban-grievance-system)
8. [Scenario 6: Audit Trail Verification](#scenario-6-audit-trail-verification)
9. [Scenario 7: Dynamic Service Registry](#scenario-7-dynamic-service-registry)
10. [Testing Checklist](#testing-checklist)

---

## Setup Instructions

### 1. Import Postman Collection

```bash
# Import the file: schema.postman.json into Postman
```

### 2. Create Postman Environment

Create a new environment with these variables:

```json
{
  "gateway_url": "http://localhost:3000/api",
  "registry_url": "http://localhost:3002/api",
  "access_token": "",
  "refresh_token": "",
  "admin_access_token": "",
  "hospital_id": "",
  "doctor_id": "",
  "slot_id": "",
  "appointment_id": "",
  "scheme_id": "",
  "application_id": "",
  "grievance_id": "",
  "category_id": ""
}
```

### 3. Start All Services

```bash
# Start infrastructure
cd infra/docker && docker-compose up -d

# Start all microservices using mprocs
mprocs
```

### 4. Verify System Health

```bash
# Check all services are running
curl http://localhost:3000/api/health         # API Gateway
curl http://localhost:3001/api/health         # Auth Service
curl http://localhost:3002/api/registry/health # Service Registry
curl http://localhost:3010/api/health         # Healthcare Service
curl http://localhost:3011/api/health         # Agriculture Service
curl http://localhost:3012/api/health         # Urban Service
```

---

## Demo Flow Overview

**Total Demo Time**: ~15 minutes
**Services Demonstrated**: 8 microservices
**Features Showcased**: Authentication, RBAC, Healthcare, Agriculture, Urban, Audit, Dynamic Routing

### Flow Sequence

1. **Platform Overview** (2 min) - Show service registry and health
2. **Authentication Demo** (2 min) - OTP login flow
3. **RBAC Security** (3 min) - Demonstrate role-based access control
4. **Healthcare Journey** (3 min) - Book doctor appointment
5. **Agriculture Services** (2 min) - Apply for scheme
6. **Urban Grievance** (2 min) - Submit complaint
7. **Audit Trail** (1 min) - Show platform logs

---

## Scenario 1: Citizen Healthcare Journey

**Goal**: Demonstrate a complete citizen journey - from authentication to booking a doctor appointment

### Step 1.1: Discover Available Services

```http
GET {{gateway_url}}/
```

**Expected Response**: Gateway info showing all registered services

### Step 1.2: Authenticate as Citizen

```http
POST {{gateway_url}}/auth/otp/send
Content-Type: application/json

{
  "mobile": "+919876543210"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "expiresIn": 300,
    "otpLength": 6
  }
}
```

**Demo Note**: In development, OTP is logged to console. Check auth-svc logs.

### Step 1.3: Verify OTP

```http
POST {{gateway_url}}/auth/otp/verify
Content-Type: application/json

{
  "mobile": "+919876543210",
  "otp": "123456"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "user": {
      "id": "uuid",
      "mobile": "+919876543210",
      "roles": ["CITIZEN"]
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

**Postman Auto-Script**: Token automatically saved to `{{access_token}}`

### Step 1.4: Browse Hospitals

```http
GET {{gateway_url}}/services/healthcare/hospitals?page=1&limit=10
```

**Expected Response**: List of hospitals with availability

**Demo Point**: This is a public endpoint - no authentication required

### Step 1.5: View Doctors

```http
GET {{gateway_url}}/services/healthcare/doctors?page=1&limit=10&specialization=cardiology
```

**Expected Response**: List of cardiologists with consultation fees

### Step 1.6: Check Doctor Availability

```http
GET {{gateway_url}}/services/healthcare/doctors/{{doctor_id}}/slots
```

**Expected Response**: Available time slots for the doctor

### Step 1.7: Book Appointment (Requires Auth)

```http
POST {{gateway_url}}/services/healthcare/appointments
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "doctorId": "{{doctor_id}}",
  "hospitalId": "{{hospital_id}}",
  "appointmentDate": "2026-02-15",
  "appointmentTime": "10:30",
  "patientName": "Rajesh Kumar",
  "patientMobile": "+919876543210",
  "symptoms": "Chest pain and shortness of breath",
  "notes": "Previous history of hypertension"
}
```

**Expected Response**:
```json
{
  "id": "appointment-uuid",
  "status": "SCHEDULED",
  "appointmentNumber": "APT-2026-001234",
  "doctor": { ... },
  "hospital": { ... }
}
```

**Demo Point**: Show that authentication is required - removing Bearer token results in 401

### Step 1.8: View My Appointments

```http
GET {{gateway_url}}/services/healthcare/appointments/me
Authorization: Bearer {{access_token}}
```

**Expected Response**: List of user's appointments

---

## Scenario 2: RBAC Security Demonstration

**Goal**: Showcase the role-based access control system and security fixes

### Step 2.1: Citizen Cannot Create Hospital (SECURITY TEST)

```http
POST {{gateway_url}}/services/healthcare/hospitals
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "Fake Hospital",
  "city": "Bangalore",
  "state": "Karnataka",
  "type": "private"
}
```

**Expected Response**:
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

**Demo Point**: ✅ SECURITY WORKING - Citizens cannot create hospitals (requires DEPARTMENT_ADMIN role)

### Step 2.2: Citizen Cannot Register Services (SECURITY TEST)

```http
POST {{registry_url}}/registry/services
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "malicious-service",
  "baseUrl": "http://evil.com"
}
```

**Expected Response**:
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**Demo Point**: ✅ CRITICAL SECURITY - Service Registry is protected from unauthorized access

### Step 2.3: Citizen Cannot View Audit Logs (SECURITY TEST)

```http
GET http://localhost:3007/api/audit/logs
Authorization: Bearer {{access_token}}
```

**Expected Response**:
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**Demo Point**: ✅ AUDIT SECURITY - Only admins can view platform logs

### Step 2.4: Citizen CAN View Public Data

```http
GET {{gateway_url}}/services/healthcare/hospitals
```

**Expected Response**: 200 OK with hospital list

**Demo Point**: ✅ Public endpoints remain accessible without authentication

---

## Scenario 3: Admin Operations

**Goal**: Demonstrate admin capabilities with DEPARTMENT_ADMIN or PLATFORM_ADMIN roles

### Step 3.1: Login as Admin

**Manual Setup Required**: Create admin user in database

```sql
-- Connect to ingenium_auth database
UPDATE users
SET roles = '["PLATFORM_ADMIN"]'
WHERE mobile = '+919999999999';
```

**Then authenticate**:

```http
POST {{gateway_url}}/auth/otp/send
Content-Type: application/json

{
  "mobile": "+919999999999"
}
```

```http
POST {{gateway_url}}/auth/otp/verify
Content-Type: application/json

{
  "mobile": "+919999999999",
  "otp": "123456"
}
```

**Postman Auto-Script**: Save admin token to `{{admin_access_token}}`

### Step 3.2: Admin Creates Hospital

```http
POST {{gateway_url}}/services/healthcare/hospitals
Authorization: Bearer {{admin_access_token}}
Content-Type: application/json

{
  "name": "Apollo Multispecialty Hospital",
  "description": "Leading private hospital with advanced facilities",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "address": "Apollo Tower, Bannerghatta Road",
  "facilities": ["Emergency", "ICU", "Cardiology", "Neurology", "Oncology"],
  "type": "private",
  "contactNumber": "+91-80-26304050",
  "email": "info@apollo-bangalore.com",
  "isActive": true,
  "totalBeds": 500,
  "availableBeds": 150
}
```

**Expected Response**: 201 Created

**Demo Point**: ✅ Admins can create hospitals

### Step 3.3: Admin Creates Doctor

```http
POST {{gateway_url}}/services/healthcare/doctors
Authorization: Bearer {{admin_access_token}}
Content-Type: application/json

{
  "name": "Dr. Rajiv Sharma",
  "specialization": "cardiology",
  "qualification": "MBBS, MD, DM (Cardiology), FESC",
  "experienceYears": 20,
  "registrationNumber": "KMC-45678",
  "contactNumber": "+91-9876543210",
  "email": "dr.sharma@apollo.com",
  "consultationFee": 800,
  "isAvailable": true,
  "hospitalId": "{{hospital_id}}"
}
```

**Expected Response**: 201 Created

### Step 3.4: Admin Creates Doctor Availability Slots

```http
POST {{gateway_url}}/services/healthcare/doctors/{{doctor_id}}/slots
Authorization: Bearer {{admin_access_token}}
Content-Type: application/json

{
  "dayOfWeek": "monday",
  "startTime": "09:00",
  "endTime": "13:00",
  "slotDurationMinutes": 15,
  "maxPatients": 20,
  "isAvailable": true
}
```

**Expected Response**: 201 Created

**Demo Point**: ✅ Complete admin workflow for hospital management

### Step 3.5: Admin Registers New Service

```http
POST {{registry_url}}/registry/services
Authorization: Bearer {{admin_access_token}}
Content-Type: application/json

{
  "name": "education",
  "displayName": "Education Services",
  "description": "Scholarships, courses, and certifications",
  "baseUrl": "http://localhost:3013",
  "healthEndpoint": "/api/health",
  "version": "1.0.0",
  "owner": "education-ministry",
  "tags": ["education", "scholarships"],
  "isPublic": false,
  "requiredRoles": ["CITIZEN"]
}
```

**Expected Response**: 201 Created

**Demo Point**: ✅ Dynamic service registration - platform is extensible

### Step 3.6: Admin Views Audit Logs

```http
GET http://localhost:3007/api/audit/logs?limit=50
Authorization: Bearer {{admin_access_token}}
```

**Expected Response**: Platform-wide audit logs

**Demo Point**: ✅ Compliance and monitoring capabilities

---

## Scenario 4: Agriculture Services

**Goal**: Demonstrate agriculture advisory and scheme application

### Step 4.1: Browse Agriculture Advisories (Public)

```http
GET {{gateway_url}}/services/agriculture/advisories?state=Karnataka&season=kharif
```

**Expected Response**: Seasonal farming advisories

### Step 4.2: View Market Prices (Public)

```http
GET {{gateway_url}}/services/agriculture/market-prices?commodity=rice&state=Karnataka
```

**Expected Response**: Real-time commodity prices

### Step 4.3: Browse Government Schemes (Public)

```http
GET {{gateway_url}}/services/agriculture/schemes?category=subsidy
```

**Expected Response**: Available schemes for farmers

### Step 4.4: Apply for Scheme (Requires Auth)

```http
POST {{gateway_url}}/services/agriculture/schemes/{{scheme_id}}/apply
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "applicantName": "Ramesh Kumar",
  "applicantMobile": "+919876543210",
  "applicantAadhar": "1234-5678-9012",
  "formData": {
    "landSize": "2.5 acres",
    "village": "Hoskote",
    "district": "Bangalore Rural",
    "state": "Karnataka",
    "cropType": "Paddy"
  },
  "documentUrls": [
    "https://storage.example.com/docs/land-certificate.pdf"
  ]
}
```

**Expected Response**: Application submitted with tracking ID

### Step 4.5: Track Application Status

```http
GET {{gateway_url}}/services/agriculture/schemes/applications/{{application_id}}
Authorization: Bearer {{access_token}}
```

**Expected Response**: Application status and timeline

---

## Scenario 5: Urban Grievance System

**Goal**: Demonstrate citizen complaint submission and tracking

### Step 5.1: Browse Grievance Categories (Public)

```http
GET {{gateway_url}}/services/urban/categories
```

**Expected Response**: List of complaint categories (roads, water, electricity, etc.)

### Step 5.2: Submit Grievance (Requires Auth)

```http
POST {{gateway_url}}/services/urban/grievances
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "categoryId": "{{category_id}}",
  "title": "Large pothole causing accidents on MG Road",
  "description": "There is a 2-foot deep pothole near City Mall junction that has caused multiple accidents. Immediate attention required.",
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
    "https://storage.example.com/images/pothole-mg-road.jpg"
  ]
}
```

**Expected Response**: Grievance registered with tracking number

### Step 5.3: Track Grievance Status

```http
GET {{gateway_url}}/services/urban/grievances/{{grievance_id}}/status
Authorization: Bearer {{access_token}}
```

**Expected Response**: Current status and assigned officer details

### Step 5.4: View My Grievances

```http
GET {{gateway_url}}/services/urban/grievances/me
Authorization: Bearer {{access_token}}
```

**Expected Response**: All grievances submitted by the user

### Step 5.5: Escalate Grievance

```http
PUT {{gateway_url}}/services/urban/grievances/{{grievance_id}}/escalate
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "reason": "No action taken for 7 days despite high priority"
}
```

**Expected Response**: Grievance escalated to higher authority

---

## Scenario 6: Audit Trail Verification

**Goal**: Demonstrate comprehensive audit logging (Admin Only)

### Step 6.1: View All Audit Logs

```http
GET http://localhost:3007/api/audit/logs?limit=100&eventType=USER_LOGIN
Authorization: Bearer {{admin_access_token}}
```

**Expected Response**: Filtered audit logs from ClickHouse

### Step 6.2: View User Activity

```http
GET http://localhost:3007/api/audit/logs/user/:userId
Authorization: Bearer {{admin_access_token}}
```

**Expected Response**: All actions performed by specific user

### Step 6.3: View Platform Statistics

```http
GET http://localhost:3007/api/audit/stats
Authorization: Bearer {{admin_access_token}}
```

**Expected Response**: Aggregate statistics (login counts, service usage, etc.)

**Demo Point**: ✅ Full compliance and audit trail for government platform

---

## Scenario 7: Dynamic Service Registry

**Goal**: Demonstrate platform extensibility via service registry

### Step 7.1: View All Registered Services

```http
GET {{registry_url}}/registry/services
```

**Expected Response**: List of all registered services

### Step 7.2: Check Platform Health

```http
GET {{registry_url}}/registry/health
```

**Expected Response**: Aggregated health status of all services

### Step 7.3: Admin Updates Service Status

```http
PUT {{registry_url}}/registry/services/healthcare/status
Authorization: Bearer {{admin_access_token}}
Content-Type: application/json

{
  "status": "MAINTENANCE"
}
```

**Expected Response**: Service status updated

**Demo Point**: ✅ Platform can manage service availability dynamically

### Step 7.4: Access Service via Gateway

```http
GET {{gateway_url}}/services/education/courses
Authorization: Bearer {{access_token}}
```

**Demo Point**: ✅ New services are immediately accessible via gateway after registration

---

## Testing Checklist

### Authentication & Authorization
- [ ] OTP login works for citizens
- [ ] JWT tokens are generated correctly
- [ ] Token refresh works
- [ ] Logout invalidates refresh token
- [ ] Expired tokens return 401
- [ ] Invalid roles return 403

### RBAC Security
- [ ] Citizens cannot create hospitals
- [ ] Citizens cannot create doctors
- [ ] Citizens cannot register services
- [ ] Citizens cannot view audit logs
- [ ] Admins CAN perform all operations
- [ ] Public endpoints remain accessible

### Healthcare Service
- [ ] Public can browse hospitals/doctors
- [ ] Authenticated users can book appointments
- [ ] Users can view their appointments
- [ ] Users can cancel appointments
- [ ] Admin can create hospitals
- [ ] Admin can create doctors
- [ ] Admin can manage time slots

### Agriculture Service
- [ ] Public can view advisories
- [ ] Public can check market prices
- [ ] Public can browse schemes
- [ ] Authenticated users can apply for schemes
- [ ] Users can track applications

### Urban Service
- [ ] Public can view categories
- [ ] Authenticated users can submit grievances
- [ ] Users can track grievances
- [ ] Users can escalate grievances
- [ ] Users can view their grievances

### Audit Service
- [ ] All API calls are logged
- [ ] Admins can view audit logs
- [ ] Admins can filter by event type
- [ ] Admins can view user activity
- [ ] Citizens cannot access audit logs

### Service Registry
- [ ] Services can be discovered
- [ ] Platform health can be checked
- [ ] Admins can register services
- [ ] Admins can update services
- [ ] Admins can delete services
- [ ] Citizens cannot modify registry

### API Gateway
- [ ] Routes requests to correct services
- [ ] Service discovery works
- [ ] Authentication is enforced
- [ ] Health checks work

---

## Performance Metrics

Track these during demo:

- **Response Times**: Most endpoints < 100ms
- **Database Queries**: < 10ms average
- **Service Discovery**: < 5ms
- **JWT Validation**: < 2ms
- **Concurrent Users**: Test with 100+ concurrent requests

---

## Troubleshooting

### Common Issues

**Issue**: 401 Unauthorized
**Fix**: Check if access_token is set in environment variables

**Issue**: 403 Forbidden
**Fix**: Verify user has correct role for the operation

**Issue**: 404 Service Not Found
**Fix**: Check if service is registered in service registry

**Issue**: 500 Internal Server Error
**Fix**: Check service logs and database connectivity

### Debug Commands

```bash
# Check service logs
docker logs ingenium-postgres
docker logs ingenium-kafka
docker logs ingenium-clickhouse

# Check database
docker exec -it ingenium-postgres psql -U postgres -d ingenium_auth
docker exec -it ingenium-postgres psql -U postgres -d ingenium_healthcare
docker exec -it ingenium-postgres psql -U postgres -d ingenium_registry

# Check ClickHouse
docker exec -it ingenium-clickhouse clickhouse-client
```

---

## Demo Script for Judges

**Opening** (30 seconds):
> "Ingenium is a comprehensive Digital Public Infrastructure platform for government services. It features a microservices architecture with 8 services, dynamic service registry, role-based access control, and comprehensive audit logging."

**Authentication Demo** (1 minute):
> "Let me show the authentication flow. We support OTP-based login via SMS. I'll send an OTP to a mobile number... verify it... and we receive JWT tokens for secure API access."

**Security Demo** (2 minutes):
> "Security is critical for government platforms. Let me demonstrate our role-based access control. As a citizen, if I try to create a hospital... 403 Forbidden. If I try to register a malicious service... 403 Forbidden. Only admins with PLATFORM_ADMIN or DEPARTMENT_ADMIN roles can perform these operations."

**Healthcare Journey** (2 minutes):
> "Now let's see a complete citizen journey. I can browse hospitals without authentication... search for cardiologists... check their availability... and book an appointment. This requires authentication. The appointment is created and I can track it."

**Dynamic Service Registry** (1 minute):
> "The platform is highly extensible. Using the service registry, admins can register new services on the fly. I'll register an education service... and it's immediately accessible via the API gateway. No code deployment needed."

**Audit Trail** (1 minute):
> "For compliance, every action is logged to ClickHouse. Admins can view comprehensive audit trails, track user activity, and generate compliance reports."

**Closing** (30 seconds):
> "This architecture supports unlimited service expansion, provides robust security through RBAC, maintains complete audit trails, and offers a unified API gateway for all government services. The platform is production-ready and built for scale."

---

## Next Steps After Demo

1. Deploy to staging environment
2. Set up CI/CD pipelines
3. Configure production databases
4. Set up monitoring (Prometheus + Grafana)
5. Enable database migrations
6. Configure SMS gateway for OTP
7. Set up SSL certificates
8. Configure rate limiting
9. Set up backup strategies
10. Load testing with 10,000+ concurrent users
