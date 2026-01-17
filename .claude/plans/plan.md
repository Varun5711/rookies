# DPI Platform Implementation Plan - Hackathon Demo

## Executive Summary

**Goal:** Build a National-Scale Digital Public Infrastructure platform with dynamic service discovery, dual authentication (Google OAuth + Mobile OTP), and three domain services (Healthcare, Agriculture, Urban).

**Current State:**
- ✅ All 8 microservices scaffolded (basic NestJS structure)
- ✅ Shared libraries implemented: `@dpi/kafka`, `@dpi/redis`
- ✅ Docker Compose ready (PostgreSQL, Redis, Kafka)
- ❌ No database integration, authentication, or business logic

**Target State:**
- Full-featured DPI platform with dynamic routing
- Both Google OAuth 2.0 and Twilio OTP authentication
- Three working domain services showcasing extensibility
- Event-driven architecture with Kafka
- Service registry with runtime service discovery

---

## Implementation Phases

### **PHASE 1: Foundation Layer** 🏗️
*Set up database layer and shared utilities*

#### 1.1 Create Database Library

**Create:**
- `libs/database/src/database.module.ts` - TypeORM configuration with PostgreSQL
- `libs/database/src/entities/base.entity.ts` - Base entity (id, createdAt, updatedAt)

**Key Implementation:**
```typescript
// TypeORM module with PostgreSQL connection
// Auto-load entities, enable synchronize for dev
// Use environment variables for connection
```

#### 1.2 Create Common Library

**Create:**
- `libs/common/src/decorators/current-user.decorator.ts` - Extract user from request
- `libs/common/src/decorators/public.decorator.ts` - Mark public endpoints
- `libs/common/src/decorators/roles.decorator.ts` - RBAC decorator
- `libs/common/src/guards/jwt-auth.guard.ts` - JWT validation guard
- `libs/common/src/guards/roles.guard.ts` - Role-based access guard
- `libs/common/src/enums/user-role.enum.ts` - User roles (citizen, service_provider, admin)
- `libs/common/src/interfaces/current-user.interface.ts` - User context type

#### 1.3 Update tsconfig.base.json

**Add path aliases:**
```json
"@dpi/database": ["libs/database/src/index.ts"],
"@dpi/common": ["libs/common/src/index.ts"]
```

#### 1.4 Install Dependencies

```bash
npm install @nestjs/typeorm typeorm pg class-validator class-transformer passport passport-jwt @nestjs/passport @nestjs/jwt bcrypt twilio
npm install -D @types/passport-jwt @types/bcrypt
```

---

### **PHASE 2: Authentication Service** 🔐
*Implement Google OAuth 2.0 and Mobile OTP authentication*

#### 2.1 User Entities

**Create:**
- `apps/auth-svc/src/modules/users/entities/user.entity.ts`
  - Fields: googleId, email, mobile, fullName, picture, mobileVerified, roles[], lastLoginAt
- `apps/auth-svc/src/modules/users/entities/refresh-token.entity.ts`
  - Fields: token, user, expiresAt, revoked
- `apps/auth-svc/src/modules/users/users.module.ts`
- `apps/auth-svc/src/modules/users/users.service.ts` - CRUD operations

#### 2.2 Google OAuth 2.0 Module

**Create:**
- `apps/auth-svc/src/modules/google/google.module.ts`
- `apps/auth-svc/src/modules/google/google.controller.ts`
  - `GET /auth/google/login` - Generate OAuth state, redirect to Google
  - `GET /auth/google/callback` - Exchange code, create/update user, return tokens
- `apps/auth-svc/src/modules/google/google.service.ts`
  - Validate state from Redis
  - Exchange code for Google token
  - Fetch user info from Google
  - Create/update user in database
  - Generate JWT tokens

**Environment Variables:**
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

#### 2.3 Mobile OTP Module (Twilio)

**Create:**
- `apps/auth-svc/src/modules/otp/otp.module.ts`
- `apps/auth-svc/src/modules/otp/otp.controller.ts`
  - `POST /auth/otp/send` - Send OTP via Twilio Verify
  - `POST /auth/otp/verify` - Verify OTP, create/update user, return tokens
- `apps/auth-svc/src/modules/otp/otp.service.ts` - Rate limiting, session management
- `apps/auth-svc/src/modules/otp/twilio.service.ts` - Twilio Verify API integration

**Environment Variables:**
```env
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_VERIFY_SERVICE_SID=your-twilio-verify-service-sid
TWILIO_PHONE_NUMBER=+1234567890
```

**Features:**
- Store OTP session in Redis (5 min TTL)
- Rate limit: 3 OTP per 10 min per mobile
- Max 3 verification attempts

#### 2.4 JWT Token Service

**Create:**
- `apps/auth-svc/src/modules/tokens/tokens.module.ts`
- `apps/auth-svc/src/modules/tokens/tokens.service.ts`
  - `generateTokens(user)` - Create access (15min) and refresh (7 days) tokens
  - `refreshTokens(refreshToken)` - Rotate tokens
- `apps/auth-svc/src/modules/tokens/strategies/jwt.strategy.ts` - Passport JWT strategy

#### 2.5 Auth Module Integration

**Update:**
- `apps/auth-svc/src/app/app.module.ts`
  - Import DatabaseModule, RedisModule, KafkaModule
  - Import UsersModule, GoogleModule, OtpModule, TokensModule

**Final Endpoints:**
- `GET /api/auth/google/login` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `POST /api/auth/refresh` - Refresh tokens
- `GET /api/auth/me` - Get current user (JWT required)
- `POST /api/auth/logout` - Revoke refresh token

---

### **PHASE 3: Service Registry** 📋
*Dynamic service discovery and health monitoring*

#### 3.1 Registry Entity & CRUD

**Create:**
- `apps/service-registry/src/modules/registry/entities/registered-service.entity.ts`
  - Fields: name, displayName, description, baseUrl, healthEndpoint, status, healthStatus, version, tags[], isPublic, requiredRoles[]
- `apps/service-registry/src/modules/registry/registry.module.ts`
- `apps/service-registry/src/modules/registry/registry.controller.ts`
  - `POST /registry/services` - Register service
  - `GET /registry/services` - List all services
  - `GET /registry/services/:name` - Get service by name
  - `PUT /registry/services/:name` - Update service
  - `DELETE /registry/services/:name` - Deregister service
  - `GET /registry/health` - Platform health aggregation
- `apps/service-registry/src/modules/registry/registry.service.ts` - Service CRUD logic

#### 3.2 Health Checker

**Create:**
- `apps/service-registry/src/modules/registry/health-checker.service.ts`
  - Cron job (every 30 seconds)
  - Check each service's health endpoint
  - Update healthStatus (HEALTHY/DEGRADED/UNHEALTHY)
  - Emit Kafka event on unhealthy

#### 3.3 Registry Module Integration

**Update:**
- `apps/service-registry/src/app/app.module.ts`
  - Import DatabaseModule, RedisModule, KafkaModule
  - Import RegistryModule
  - Enable @nestjs/schedule for cron jobs

---

### **PHASE 4: API Gateway** 🌐
*Dynamic routing with service discovery*

#### 4.1 Dynamic Proxy Controller

**Create:**
- `apps/api-gateway/src/modules/proxy/proxy.module.ts`
- `apps/api-gateway/src/modules/proxy/proxy.controller.ts`
  - `@All('services/:serviceName/*')` - Dynamic route handler
  - Resolve service from registry (with Redis cache)
  - Check authentication if service is not public
  - Forward request to target service
- `apps/api-gateway/src/modules/proxy/proxy.service.ts` - HTTP forwarding with axios
- `apps/api-gateway/src/modules/proxy/service-registry.client.ts` - Service discovery client

**Key Logic:**
```typescript
// 1. Extract serviceName from URL: /api/services/{serviceName}/*
// 2. Query Service Registry (check Redis cache first, TTL: 5min)
// 3. If service not found or inactive → 404
// 4. If service requires auth and no JWT → 401
// 5. Construct target URL: service.baseUrl + remaining path
// 6. Forward request with headers (correlation ID, user context)
// 7. Return response
```

#### 4.2 Auth Proxy

**Create:**
- `apps/api-gateway/src/modules/auth-proxy/auth-proxy.module.ts`
- `apps/api-gateway/src/modules/auth-proxy/auth-proxy.controller.ts`
  - `@All('auth/*')` - Forward all `/api/auth/*` to auth-svc

#### 4.3 Middleware

**Create:**
- `apps/api-gateway/src/middleware/correlation-id.middleware.ts` - Generate/extract correlation ID
- `apps/api-gateway/src/middleware/rate-limit.middleware.ts` - Rate limiting (100 req/min per user)

#### 4.4 Gateway Module Integration

**Update:**
- `apps/api-gateway/src/app/app.module.ts`
  - Import RedisModule, HttpModule
  - Import ProxyModule, AuthProxyModule
  - Apply middleware globally

---

### **PHASE 5: Domain Services** 🏥🌾🏙️
*Implement Healthcare, Agriculture, and Urban services in parallel*

#### 5.1 Healthcare Service

**Create Entities:**
- `apps/healthcare-svc/src/modules/hospitals/entities/hospital.entity.ts`
  - Fields: name, city, state, pincode, facilities[], isActive
- `apps/healthcare-svc/src/modules/doctors/entities/doctor.entity.ts`
  - Fields: name, specialization, hospital (ManyToOne)
- `apps/healthcare-svc/src/modules/doctors/entities/time-slot.entity.ts`
  - Fields: doctor, startTime, endTime, isAvailable
- `apps/healthcare-svc/src/modules/appointments/entities/appointment.entity.ts`
  - Fields: userId, doctor, hospital, appointmentDate, status (PENDING/CONFIRMED/CANCELLED), symptoms

**Create Modules:**
- Hospitals Module (controller, service)
- Doctors Module (controller, service)
- Appointments Module (controller, service)
- Health Controller (`GET /api/health`)

**Update:**
- `apps/healthcare-svc/src/app/app.module.ts`
  - Import DatabaseModule, RedisModule, KafkaModule
  - Import feature modules

**Endpoints:**
- `GET /api/hospitals` - List hospitals
- `GET /api/hospitals/:id` - Hospital details
- `GET /api/doctors` - List doctors
- `GET /api/doctors/:id/slots` - Available slots
- `POST /api/appointments` - Book appointment (emit Kafka event)
- `GET /api/me/appointments` - My appointments
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/health` - Health check

**Kafka Events:**
- Emit `dpi.healthcare.appointment-booked` on successful booking

#### 5.2 Agriculture Service

**Create Entities:**
- `apps/agriculture-svc/src/modules/advisories/entities/advisory.entity.ts`
  - Fields: cropName, season, state, advisory (text), isActive
- `apps/agriculture-svc/src/modules/schemes/entities/scheme.entity.ts`
  - Fields: name, description, benefitAmount, eligibilityCriteria (jsonb), startDate, endDate
- `apps/agriculture-svc/src/modules/schemes/entities/application.entity.ts`
  - Fields: userId, scheme, status (PENDING/APPROVED/REJECTED), formData (jsonb)
- `apps/agriculture-svc/src/modules/market-prices/entities/commodity-price.entity.ts`
  - Fields: commodity, mandi, state, minPrice, maxPrice, priceDate

**Create Modules:**
- Advisories Module
- Schemes Module
- Market Prices Module
- Health Controller

**Update:**
- `apps/agriculture-svc/src/app/app.module.ts`

**Endpoints:**
- `GET /api/advisories` - List advisories
- `GET /api/schemes` - Available schemes
- `POST /api/schemes/:id/apply` - Apply for scheme (emit Kafka event)
- `GET /api/me/applications` - My applications
- `GET /api/market-prices` - Current market prices
- `GET /api/health` - Health check

**Kafka Events:**
- Emit `dpi.agriculture.scheme-applied` on application

#### 5.3 Urban Service

**Create Entities:**
- `apps/urban-svc/src/modules/grievances/entities/category.entity.ts`
  - Fields: name, department
- `apps/urban-svc/src/modules/grievances/entities/grievance.entity.ts`
  - Fields: userId, category, title, description, location, attachments[], status (SUBMITTED/IN_PROGRESS/RESOLVED), assignedTo, resolution, resolvedAt

**Create Modules:**
- Grievances Module
- Categories Module
- Health Controller

**Update:**
- `apps/urban-svc/src/app/app.module.ts`

**Endpoints:**
- `GET /api/categories` - List categories
- `POST /api/grievances` - Submit grievance (emit Kafka event)
- `GET /api/grievances/:id` - Get status
- `GET /api/me/grievances` - My grievances
- `PUT /api/grievances/:id/escalate` - Escalate
- `GET /api/health` - Health check

**Kafka Events:**
- Emit `dpi.urban.grievance-submitted` on submission

---

### **PHASE 6: Notification & Audit Services** 📱📊
*Event-driven notification and compliance logging*

#### 6.1 Notification Service

**Create:**
- `apps/notification-svc/src/consumers/notification.consumer.ts`
  - Listen to: `dpi.healthcare.appointment-booked`, `dpi.agriculture.scheme-applied`, etc.
  - Send SMS via Twilio for important events
- `apps/notification-svc/src/services/sms.service.ts` - Twilio SMS client
- `apps/notification-svc/src/services/email.service.ts` - Email client (optional)

**Update:**
- `apps/notification-svc/src/app/app.module.ts`
  - Configure Kafka consumer

**SMS Templates:**
- Appointment confirmation: "Your appointment with Dr. {name} is confirmed for {date}."
- Scheme application: "Your application for {scheme} has been received."

#### 6.2 Audit Service

**Create:**
- `apps/audit-svc/src/entities/audit-log.entity.ts`
  - Fields: eventType, userId, serviceName, eventData (jsonb), timestamp, correlationId
- `apps/audit-svc/src/consumers/audit.consumer.ts`
  - Listen to: `dpi.*` (all events)
  - Log all events to database
- `apps/audit-svc/src/services/audit.service.ts` - Audit log CRUD

**Update:**
- `apps/audit-svc/src/app/app.module.ts`

---

### **PHASE 7: Integration & Demo Preparation** 🚀
*Service registration, seeding, and testing*

#### 7.1 Service Registration Script

**Create:**
- `scripts/register-services.sh`
  - Register healthcare, agriculture, urban services in Service Registry
  - Use curl to POST to `/api/registry/services`

**Make executable:**
```bash
chmod +x scripts/register-services.sh
```

#### 7.2 Database Seeding

**Create:**
- `scripts/seed/seed.ts` - Main seeder
- `scripts/seed/seed-hospitals.ts` - Sample hospitals (10-15)
- `scripts/seed/seed-doctors.ts` - Sample doctors (20-30)
- `scripts/seed/seed-schemes.ts` - Sample schemes (5-10)
- `scripts/seed/seed-categories.ts` - Grievance categories (water, roads, garbage, etc.)

#### 7.3 Integration Testing

**Test Scenarios:**

1. **Google OAuth Flow**
   - Navigate to `http://localhost:3000/api/auth/google/login`
   - Login with Google
   - Verify JWT tokens received

2. **Mobile OTP Flow**
   - POST to `/api/auth/otp/send` with mobile number
   - Receive OTP on phone
   - POST to `/api/auth/otp/verify` with OTP
   - Verify JWT tokens received

3. **Dynamic Service Discovery**
   - GET `http://localhost:3000/api/services/healthcare/hospitals`
   - Verify gateway resolves to healthcare-svc
   - No hardcoded routes!

4. **Book Appointment (End-to-End)**
   - Login via Google OAuth
   - GET `/api/services/healthcare/hospitals`
   - GET `/api/services/healthcare/doctors`
   - POST `/api/services/healthcare/appointments`
   - Verify SMS received (Notification service)
   - Verify event logged (Audit service)

5. **Apply for Scheme**
   - POST `/api/services/agriculture/schemes/:id/apply`
   - Check application status

6. **Submit Grievance**
   - POST `/api/services/urban/grievances`
   - Track status

7. **Platform Extensibility Demo**
   - Register new "education" service via Service Registry API
   - Immediately access via Gateway: `/api/services/education/*`
   - **NO GATEWAY CODE CHANGES NEEDED** ✨

---

## Startup Sequence

### 1. Start Infrastructure
```bash
cd infra/docker
docker-compose up -d
```

**Verify:**
- PostgreSQL: `psql -h localhost -U postgres -d ingenium`
- Redis: `redis-cli ping`
- Kafka UI: http://localhost:8080

### 2. Install Dependencies
```bash
npm install
```

### 3. Update Environment Variables
Add to `.env`:
```env
# Database
DB_SYNCHRONIZE=true  # Auto-sync entities in dev

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 4. Start Services (in order)

**Option A: Use mprocs (recommended)**
```bash
mprocs
```

**Option B: Manual start**
```bash
# Terminal 1: Service Registry
npm run dev -- service-registry

# Terminal 2: Auth Service
npm run dev -- auth-svc

# Terminal 3: API Gateway
npm run dev -- api-gateway

# Terminal 4: Healthcare Service
npm run dev -- healthcare-svc

# Terminal 5: Agriculture Service
npm run dev -- agriculture-svc

# Terminal 6: Urban Service
npm run dev -- urban-svc

# Terminal 7: Notification Service
npm run dev -- notification-svc

# Terminal 8: Audit Service
npm run dev -- audit-svc
```

### 5. Register Services
```bash
./scripts/register-services.sh
```

**Verify:**
```bash
curl http://localhost:3002/api/registry/services
```

### 6. Seed Database
```bash
npm run seed
```

### 7. Test Gateway
```bash
# Health check
curl http://localhost:3000/api/services/healthcare/health

# List hospitals (requires JWT)
curl http://localhost:3000/api/services/healthcare/hospitals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Verification Checklist

### Phase 1: Foundation
- [ ] TypeORM connects to PostgreSQL
- [ ] Base entity has id, createdAt, updatedAt
- [ ] Common guards and decorators compile
- [ ] Path aliases work: `import { DatabaseModule } from '@dpi/database'`

### Phase 2: Authentication
- [ ] Google OAuth redirects to Google login
- [ ] OAuth callback creates/updates user in database
- [ ] JWT tokens generated with 15min/7day expiry
- [ ] Mobile OTP sends SMS via Twilio
- [ ] OTP verification creates user and returns tokens
- [ ] `/api/auth/me` returns current user
- [ ] Token refresh rotates tokens

### Phase 3: Service Registry
- [ ] Can register a service via POST
- [ ] Can list all services via GET
- [ ] Can get service by name
- [ ] Health checker runs every 30 seconds
- [ ] Service health status updates (HEALTHY/UNHEALTHY)

### Phase 4: API Gateway
- [ ] Gateway resolves `/api/services/healthcare/*` to healthcare-svc
- [ ] Service not found returns 404
- [ ] Inactive service returns 404
- [ ] Redis caches service info (5min TTL)
- [ ] Auth proxy forwards `/api/auth/*` to auth-svc
- [ ] Rate limiting works (100 req/min)
- [ ] Correlation ID added to all requests

### Phase 5: Domain Services
- [ ] Healthcare: Can list hospitals, doctors
- [ ] Healthcare: Can book appointment (emits Kafka event)
- [ ] Agriculture: Can list schemes, apply for scheme
- [ ] Urban: Can submit grievance
- [ ] All services have `/api/health` endpoint
- [ ] All services registered in Service Registry

### Phase 6: Supporting Services
- [ ] Notification service consumes Kafka events
- [ ] SMS sent on appointment booking
- [ ] Audit service logs all events
- [ ] Events visible in Kafka UI

### Phase 7: End-to-End
- [ ] Complete OAuth flow from login to JWT
- [ ] Complete OTP flow from send to verify
- [ ] Book appointment end-to-end (auth → gateway → service → Kafka → notification)
- [ ] Register new service → immediately accessible via gateway
- [ ] All services healthy in registry

---

## Critical Files by Phase

### Phase 1
- `libs/database/src/database.module.ts`
- `libs/database/src/entities/base.entity.ts`
- `libs/common/src/guards/jwt-auth.guard.ts`
- `libs/common/src/enums/user-role.enum.ts`
- `tsconfig.base.json`

### Phase 2
- `apps/auth-svc/src/modules/users/entities/user.entity.ts`
- `apps/auth-svc/src/modules/users/entities/refresh-token.entity.ts`
- `apps/auth-svc/src/modules/google/google.service.ts`
- `apps/auth-svc/src/modules/otp/twilio.service.ts`
- `apps/auth-svc/src/modules/tokens/tokens.service.ts`
- `apps/auth-svc/src/app/app.module.ts`

### Phase 3
- `apps/service-registry/src/modules/registry/entities/registered-service.entity.ts`
- `apps/service-registry/src/modules/registry/registry.service.ts`
- `apps/service-registry/src/modules/registry/health-checker.service.ts`

### Phase 4
- `apps/api-gateway/src/modules/proxy/proxy.controller.ts`
- `apps/api-gateway/src/modules/proxy/service-registry.client.ts`
- `apps/api-gateway/src/modules/auth-proxy/auth-proxy.controller.ts`

### Phase 5
- `apps/healthcare-svc/src/modules/appointments/appointments.service.ts`
- `apps/agriculture-svc/src/modules/schemes/schemes.service.ts`
- `apps/urban-svc/src/modules/grievances/grievances.service.ts`

### Phase 6
- `apps/notification-svc/src/consumers/notification.consumer.ts`
- `apps/audit-svc/src/consumers/audit.consumer.ts`

### Phase 7
- `scripts/register-services.sh`
- `scripts/seed/seed.ts`

---

## Key Architecture Decisions

1. **Dynamic Routing:** API Gateway uses `@All('services/:serviceName/*')` to resolve routes at runtime from Service Registry
2. **Service Discovery:** Services registered via REST API, cached in Redis (5min TTL)
3. **Authentication:** Dual methods (Google OAuth + Mobile OTP), JWT with refresh token rotation
4. **Event-Driven:** Kafka for async communication between services
5. **Health Monitoring:** Cron job checks service health every 30 seconds
6. **Extensibility:** New services can be added without modifying gateway code

---

## Demo Talking Points

1. **No Hardcoded Routes:** Show how adding a new service to registry makes it immediately accessible via gateway
2. **Dual Authentication:** Demonstrate both Google OAuth and mobile OTP flows
3. **Event-Driven:** Show Kafka UI with real-time events flowing between services
4. **Health Monitoring:** Show service registry health aggregation
5. **Horizontal Scalability:** All services are stateless, can be scaled independently
6. **National Scale Ready:** Architecture supports millions of users with caching, async processing, and microservices

---

## Success Metrics

- [ ] All 8 services running and healthy
- [ ] Can login with Google OAuth
- [ ] Can login with Mobile OTP
- [ ] Can access healthcare/agriculture/urban services via gateway
- [ ] Can book appointment and receive SMS
- [ ] Can register new service and access it immediately
- [ ] All events logged in audit service
- [ ] Zero hardcoded service routes in gateway

---

**Estimated Implementation Time:**
- Phase 1: 2-3 hours
- Phase 2: 4-5 hours
- Phase 3: 2-3 hours
- Phase 4: 2-3 hours
- Phase 5: 6-8 hours (parallel implementation)
- Phase 6: 2-3 hours
- Phase 7: 2-3 hours

**Total: 20-30 hours** (with breaks, can be split across multiple days)