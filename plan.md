# National-Scale Digital Public Infrastructure (DPI) - Implementation Plan

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3+-orange.svg)](https://typeorm.io)

## Executive Summary

This plan outlines the architecture and implementation of a **National-Scale Digital Public Infrastructure (DPI)** platform—a unified, modular digital backbone enabling seamless, scalable, and interoperable public service delivery across healthcare, agriculture, and urban management domains.

> **🚀 Hackathon Project** - Built with love for scalable, real-world government digital infrastructure.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technical Architecture](#2-technical-architecture)
3. [Core Platform Components](#3-core-platform-components)
4. [Domain Services](#4-domain-services)
5. [Data Exchange & Interoperability](#5-data-exchange--interoperability)
6. [Scalability & Reliability](#6-scalability--reliability-mechanisms)
7. [Observability Stack](#7-observability-stack)
8. [Security Implementation](#8-security-implementation)
9. [Quick Start](#9-quick-start)
10. [API Reference](#10-api-reference)

---

## 1. System Overview

### 1.1 Vision

Create a **federated microservices platform** that enables:
- **Interoperability**: Standardized REST APIs allowing any government service to integrate
- **Scalability**: Horizontal scaling to handle national-scale traffic (100M+ citizens)
- **Resilience**: Fault-tolerant design with graceful degradation
- **Security**: Enterprise-grade authentication with DigiLocker + Aadhaar integration

### 1.2 Key Stakeholders

| Stakeholder | Role | Primary Needs |
|------------|------|---------------|
| **Citizens** | End Users | Access to services via unified portal/apps |
| **Government Administrators** | Operators | Dashboard, analytics, service management |
| **Service Providers** | Integrators | API documentation, SDKs, onboarding tools |

### 1.3 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Web Portal │  │ Mobile Apps │  │ Third-Party │  │   Admin     │         │
│  │   (React)   │  │   (React    │  │    Apps     │  │  Dashboard  │         │
│  │             │  │   Native)   │  │             │  │             │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          └────────────────┴────────┬───────┴────────────────┘
                                    │
┌───────────────────────────────────┼─────────────────────────────────────────┐
│                              API LAYER                                       │
│                    ┌──────────────┴──────────────┐                          │
│                    │       API GATEWAY           │                          │
│                    │   (NestJS + Rate Limiting)  │                          │
│                    │   Port: 3000                │                          │
│                    └──────────────┬──────────────┘                          │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼─────────────────────────────────────────┐
│                         PLATFORM CORE                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Auth     │  │   Service   │  │  Notifi-    │  │    Audit    │         │
│  │   Service   │  │  Registry   │  │  cation Svc │  │   Service   │         │
│  │  Port:3001  │  │  Port:3002  │  │  Port:3003  │  │  Port:3004  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼─────────────────────────────────────────┐
│                         DOMAIN SERVICES                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   Healthcare    │  │   Agriculture   │  │     Urban       │              │
│  │    Service      │  │    Service      │  │    Service      │              │
│  │   Port: 3010    │  │   Port: 3011    │  │   Port: 3012    │              │
│  │                 │  │                 │  │                 │              │
│  │ • Appointments  │  │ • Advisories    │  │ • Grievances    │              │
│  │ • Hospitals     │  │ • Schemes       │  │ • Complaints    │              │
│  │ • Doctors       │  │ • Market Prices │  │ • Tracking      │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼─────────────────────────────────────────┐
│                           DATA LAYER                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                          │
│  │ PostgreSQL  │  │    Redis    │  │    Kafka    │                          │
│  │   (TypeORM) │  │   (Cache)   │  │  (Events)   │                          │
│  │  Port:5432  │  │  Port:6379  │  │  Port:9092  │                          │
│  └─────────────┘  └─────────────┘  └─────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Architecture

### 2.1 Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Monorepo** | Nx | Modular builds, shared libraries, consistent tooling |
| **Runtime** | Node.js 20+ | Event-driven, high concurrency |
| **Framework** | NestJS 10+ | Enterprise-grade, modular, excellent DI |
| **ORM** | TypeORM | Type-safe database access, migrations, relations |
| **API Protocol** | REST (JSON) | Simple, universal, easy to test |
| **Messaging** | Apache Kafka | Event-driven architecture, durability |
| **Caching** | Redis | Low-latency caching, session management |
| **Database** | PostgreSQL 16 | Robust, ACID-compliant, JSON support |
| **Containerization** | Docker Compose | Local dev, consistent environments |

### 2.2 Project Structure

```
india-dpi/
├── apps/                          # Microservices
│   ├── api-gateway/               # External API Gateway (Port 3000)
│   ├── auth-svc/                  # Identity & Authentication (Port 3001)
│   ├── service-registry/          # Service Registry (Port 3002)
│   ├── notification-svc/          # Notifications (Port 3003)
│   ├── audit-svc/                 # Audit Logging (Port 3004)
│   ├── healthcare-svc/            # Healthcare Domain (Port 3010)
│   ├── agriculture-svc/           # Agriculture Domain (Port 3011)
│   └── urban-svc/                 # Urban/Smart City (Port 3012)
│
├── libs/                          # Shared Libraries
│   ├── common/                    # Common utilities, decorators, DTOs
│   ├── database/                  # TypeORM config, base entities
│   ├── kafka/                     # Kafka producer/consumer wrapper
│   ├── redis/                     # Redis client wrapper
│   ├── auth/                      # Auth guards, JWT strategies
│   └── observability/             # Metrics, health checks
│
├── docker-compose.yml             # Infrastructure (Postgres, Redis, Kafka)
├── nx.json                        # Nx workspace configuration
├── package.json                   # Root dependencies
├── tsconfig.base.json             # Shared TypeScript config
└── README.md                      # This file
```

---

## 3. Core Platform Components

### 3.1 API Gateway (Port 3000)

Single entry point for all external requests.

**Features:**
- Request routing to domain services
- JWT validation
- Rate limiting (100 req/min per user)
- Request logging
- Response caching

**Key Endpoints:**
```
GET  /health                    # Health check
GET  /api/v1/services           # List registered services
*    /api/v1/auth/*             # Proxy to auth-svc
*    /api/v1/healthcare/*       # Proxy to healthcare-svc
*    /api/v1/agriculture/*      # Proxy to agriculture-svc
*    /api/v1/urban/*            # Proxy to urban-svc
```

### 3.2 Auth Service (Port 3001) - DigiLocker + Aadhaar

**Authentication Methods:**
1. **DigiLocker OAuth2.0** (Primary) - Aadhaar eKYC
2. **Mobile OTP** (Fallback)
3. **Admin Login** (Username/Password)

**DigiLocker Flow:**
```
1. User clicks "Login with DigiLocker"
2. Redirect to DigiLocker consent screen
3. User authenticates with Aadhaar OTP
4. DigiLocker returns auth code
5. Exchange code for access token
6. Fetch eKYC data (name, DOB, address, photo)
7. Create/update user profile
8. Issue DPI JWT token
```

**Endpoints:**
```
GET  /auth/digilocker/login     # Initiate DigiLocker OAuth
GET  /auth/digilocker/callback  # OAuth callback
POST /auth/otp/send             # Send mobile OTP
POST /auth/otp/verify           # Verify OTP and login
POST /auth/admin/login          # Admin username/password login
GET  /auth/me                   # Get current user profile
POST /auth/refresh              # Refresh JWT token
POST /auth/logout               # Logout (invalidate token)
```

### 3.3 Service Registry (Port 3002)

Central registry for service discovery and health monitoring.

**Endpoints:**
```
POST /registry/services         # Register a service
GET  /registry/services         # List all services
GET  /registry/services/:id     # Get service details
PUT  /registry/services/:id     # Update service status
DELETE /registry/services/:id   # Deregister service
GET  /registry/health           # Aggregated health status
```

---

## 4. Domain Services

### 4.1 Healthcare Service (Port 3010)

**Entities:**
- Hospital, Doctor, Department
- Appointment, Prescription
- Patient (linked to Citizen)

**Endpoints:**
```
# Hospitals
GET  /healthcare/hospitals              # List hospitals (with filters)
GET  /healthcare/hospitals/:id          # Get hospital details
GET  /healthcare/hospitals/:id/doctors  # List doctors at hospital

# Doctors
GET  /healthcare/doctors/:id            # Get doctor details
GET  /healthcare/doctors/:id/slots      # Get available time slots

# Appointments
POST /healthcare/appointments           # Book appointment
GET  /healthcare/appointments/:id       # Get appointment details
PUT  /healthcare/appointments/:id       # Update appointment
DELETE /healthcare/appointments/:id     # Cancel appointment
GET  /healthcare/me/appointments        # List my appointments
```

### 4.2 Agriculture Service (Port 3011)

**Entities:**
- Farmer, FarmLand
- CropAdvisory, Scheme
- SchemeApplication

**Endpoints:**
```
# Farmer Registration
POST /agriculture/farmers/register      # Register as farmer
GET  /agriculture/farmers/me            # Get farmer profile

# Advisories
GET  /agriculture/advisories            # List advisories (filtered)
GET  /agriculture/advisories/:id        # Get advisory details

# Schemes
GET  /agriculture/schemes               # List available schemes
GET  /agriculture/schemes/:id           # Get scheme details
POST /agriculture/schemes/:id/apply     # Apply for scheme
GET  /agriculture/me/applications       # List my applications

# Market Prices
GET  /agriculture/market-prices         # Get current market prices
```

### 4.3 Urban Service (Port 3012)

**Entities:**
- Grievance, Category
- StatusUpdate, Assignment
- SatisfactionRating

**Endpoints:**
```
# Grievances
POST /urban/grievances                  # Submit grievance
GET  /urban/grievances/:id              # Get grievance status
GET  /urban/grievances/:id/timeline     # Get status history
PUT  /urban/grievances/:id              # Update grievance
POST /urban/grievances/:id/comments     # Add comment
PUT  /urban/grievances/:id/escalate     # Escalate grievance
POST /urban/grievances/:id/feedback     # Submit satisfaction rating
GET  /urban/me/grievances               # List my grievances

# Categories
GET  /urban/categories                  # List grievance categories
```

---

## 5. Data Exchange & Interoperability

### 5.1 Inter-Service Communication

All services communicate via **REST APIs**:
- API Gateway proxies external requests
- Services call each other directly for internal operations
- Async events via Kafka for decoupled operations

### 5.2 Kafka Event Topics

```
dpi.auth.user-registered        # New user registered
dpi.auth.user-updated           # User profile updated
dpi.healthcare.appointment-booked
dpi.healthcare.appointment-cancelled
dpi.agriculture.advisory-published
dpi.agriculture.scheme-applied
dpi.urban.grievance-submitted
dpi.urban.grievance-resolved
dpi.notification.send           # Trigger notification
dpi.audit.event                 # Audit log event
```

### 5.3 Event Schema (CloudEvents)

```typescript
interface DPIEvent<T> {
  id: string;                   // UUID
  type: string;                 // Event type
  source: string;               // Service name
  time: string;                 // ISO 8601 timestamp
  data: T;                      // Event payload
  correlationId: string;        // Request correlation
  userId?: string;              // Acting user
}
```

---

## 6. Scalability & Reliability Mechanisms

### 6.1 Caching Strategy (Redis)

| Data | TTL | Purpose |
|------|-----|---------|
| User Sessions | 24h | JWT validation cache |
| Service Registry | 5m | Service discovery |
| Hospital List | 1h | Reference data |
| Doctor Slots | 5m | Frequently changing |
| Advisories | 15m | Semi-static content |
| Rate Limits | 1m | Per-user throttling |

### 6.2 Circuit Breaker

Each service implements circuit breaker for external calls:
- **Timeout**: 5 seconds
- **Error Threshold**: 50%
- **Reset Timeout**: 30 seconds
- **Fallback**: Return cached data or graceful error

### 6.3 Health Checks

Every service exposes `/health` endpoint:
```json
{
  "status": "healthy",
  "checks": {
    "database": "up",
    "redis": "up",
    "kafka": "up"
  },
  "uptime": 3600,
  "version": "1.0.0"
}
```

---

## 7. Observability Stack

### 7.1 Logging
- Structured JSON logs (Pino)
- Correlation IDs across services
- Log levels: debug, info, warn, error

### 7.2 Metrics
- HTTP request duration
- Active connections
- Database query time
- Cache hit/miss ratio
- Business metrics (appointments/day, grievances/day)

### 7.3 Health Dashboard
- Service availability matrix
- Request latency percentiles
- Error rate trends
- Business KPIs

---

## 8. Security Implementation

### 8.1 Authentication
- DigiLocker OAuth2.0 with Aadhaar eKYC
- JWT tokens (RS256 signed)
- Refresh token rotation
- Session invalidation

### 8.2 Authorization (RBAC)
| Role | Permissions |
|------|-------------|
| `citizen` | Read/write own data, book appointments, file grievances |
| `service_provider` | Manage assigned services, view reports |
| `department_admin` | Manage department data, approve applications |
| `platform_admin` | Full system access, user management |

### 8.3 API Security
- HTTPS (TLS 1.3)
- Rate limiting
- Input validation (class-validator)
- SQL injection prevention (TypeORM parameterized queries)
- XSS prevention (sanitization)

---

## 9. Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- pnpm (recommended) or npm

### Run Locally

```bash
# Clone the repository
git clone https://github.com/your-org/india-dpi.git
cd india-dpi

# Install dependencies
pnpm install

# Start infrastructure (Postgres, Redis, Kafka)
docker-compose up -d

# Run database migrations
pnpm run migration:run

# Seed sample data
pnpm run seed

# Start all services (development)
pnpm run dev

# Or start individual service
pnpm run dev:api-gateway
pnpm run dev:auth-svc
pnpm run dev:healthcare-svc
```

### Access Points

| Service | URL |
|---------|-----|
| API Gateway | http://localhost:3000 |
| API Docs (Swagger) | http://localhost:3000/api |
| Health Dashboard | http://localhost:3000/health |
| Kafka UI | http://localhost:8080 |

---

## 10. API Reference

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

### Common Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-17T12:00:00Z",
    "requestId": "uuid"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  },
  "meta": {
    "timestamp": "2026-01-17T12:00:00Z",
    "requestId": "uuid"
  }
}
```

---

## Assumptions

1. **DigiLocker Integration**: Using Sandbox API (production requires MeitY partnership)
2. **Aadhaar eKYC**: DigiLocker handles verification - no direct UIDAI integration
3. **Data**: Synthetic sample data for demo purposes
4. **Scale**: Designed for millions of users, demo runs on single Docker host
5. **SMS Gateway**: Mock service (production would use MSG91/Kaleyra)

---

## Future Roadmap

- [ ] Multi-language support (Hindi, regional languages)
- [ ] AI-powered chatbot integration
- [ ] UPI payment integration
- [ ] Mobile app SDKs
- [ ] ABHA (Ayushman Bharat Health Account) integration
- [ ] Blockchain audit trail

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

**Built with ❤️ for Digital India**