# Audit Service End-to-End Demo for Judges

**Complete Audit Trail & Compliance Demonstration**

---

## 📋 Overview

The Audit Service provides **comprehensive audit logging** for the entire DPI platform using:
- **ClickHouse** for high-performance analytics
- **Kafka** for event streaming
- **90-day retention** for compliance
- **Role-based access** (Admin only)

---

## 🎯 Event Types Available

### Healthcare Events (3 types)
| Event Type | Description | Trigger |
|------------|-------------|---------|
| `dpi.healthcare.appointment-booked` | Patient books doctor appointment | POST /appointments |
| `dpi.healthcare.appointment-cancelled` | Patient cancels appointment | PUT /appointments/:id/cancel |
| `dpi.healthcare.appointment-updated` | Appointment details changed | PUT /appointments/:id |

### Agriculture Events (4 types)
| Event Type | Description | Trigger |
|------------|-------------|---------|
| `dpi.agriculture.scheme-applied` | Farmer applies for scheme | POST /schemes/:id/apply |
| `dpi.agriculture.scheme-approved` | Admin approves application | PUT /applications/:id/approve |
| `dpi.agriculture.scheme-rejected` | Admin rejects application | PUT /applications/:id/reject |
| `dpi.agriculture.advisory-published` | New farming advisory published | POST /advisories |

### Urban Events (4 types)
| Event Type | Description | Trigger |
|------------|-------------|---------|
| `dpi.urban.grievance-submitted` | Citizen submits complaint | POST /grievances |
| `dpi.urban.grievance-updated` | Grievance status updated | PUT /grievances/:id |
| `dpi.urban.grievance-escalated` | Complaint escalated | PUT /grievances/:id/escalate |
| `dpi.urban.grievance-resolved` | Issue marked resolved | PUT /grievances/:id/resolve |

### Auth Events (2 types)
| Event Type | Description | Trigger |
|------------|-------------|---------|
| `dpi.auth.user-registered` | New user registered | POST /auth/otp/verify (first time) |
| `dpi.auth.user-updated` | User profile updated | PUT /users/:id |

**Total: 13 Event Types across 4 services**

---

## 🚀 Demo Flow for Judges (10 minutes)

### Part 1: Generate Audit Events (5 min)

**Step 1: Healthcare Event - Book Appointment**

```bash
POST http://localhost:3010/api/appointments
Authorization: Bearer {{citizen_token}}
Content-Type: application/json

{
  "doctorId": "{{doctor_id}}",
  "hospitalId": "{{hospital_id}}",
  "appointmentDate": "2026-02-15",
  "appointmentTime": "10:30",
  "patientName": "Rajesh Kumar",
  "patientMobile": "8758830100",
  "symptoms": "Chest pain"
}
```

**Event Generated**: `dpi.healthcare.appointment-booked`

---

**Step 2: Agriculture Event - Apply for Scheme**

```bash
POST http://localhost:3011/api/schemes/{{scheme_id}}/apply
Authorization: Bearer {{citizen_token}}
Content-Type: application/json

{
  "applicantName": "Ramesh Kumar",
  "applicantMobile": "8758830100",
  "applicantAadhar": "1234-5678-9012",
  "formData": {
    "landSize": "2.5 acres",
    "village": "Hoskote",
    "district": "Bangalore Rural",
    "state": "Karnataka"
  }
}
```

**Event Generated**: `dpi.agriculture.scheme-applied`

---

**Step 3: Urban Event - Submit Grievance**

```bash
POST http://localhost:3012/api/grievances
Authorization: Bearer {{citizen_token}}
Content-Type: application/json

{
  "categoryId": "{{category_id}}",
  "title": "Pothole on MG Road",
  "description": "Large pothole causing accidents",
  "location": "MG Road, near City Mall",
  "priority": "high",
  "complainantName": "Suresh Kumar",
  "complainantMobile": "8758830100"
}
```

**Event Generated**: `dpi.urban.grievance-submitted`

---

**Step 4: Cancel Appointment (Generate 2nd Healthcare Event)**

```bash
PUT http://localhost:3010/api/appointments/{{appointment_id}}/cancel
Authorization: Bearer {{citizen_token}}
Content-Type: application/json

{
  "reason": "Schedule conflict"
}
```

**Event Generated**: `dpi.healthcare.appointment-cancelled`

---

### Part 2: Query Audit Logs (5 min)

**Demo Point**: Show judges that all events are captured automatically via Kafka

---

**Query 1: View All Recent Audit Logs**

```bash
GET http://localhost:3004/api/audit/logs?limit=50
Authorization: Bearer {{admin_token}}
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "event_type": "dpi.healthcare.appointment-cancelled",
      "service_name": "healthcare-svc",
      "user_id": "d226f19e-4fda-45e4-9c13-66982fa2f67e",
      "event_data": {
        "appointmentId": "...",
        "cancellationReason": "Schedule conflict",
        "timestamp": "2026-01-17T21:30:00.000Z"
      },
      "timestamp": "2026-01-17T21:30:00.000Z"
    },
    // ... more events
  ]
}
```

**Demo Point**: ✅ All user actions are automatically logged

---

**Query 2: Filter by Event Type - Healthcare Only**

```bash
GET http://localhost:3004/api/audit/logs/event/dpi.healthcare.appointment-booked
Authorization: Bearer {{admin_token}}
```

**Expected**: Only appointment booking events

**Demo Point**: ✅ Filter by specific actions for compliance reporting

---

**Query 3: Track User Activity**

```bash
GET http://localhost:3004/api/audit/logs/user/d226f19e-4fda-45e4-9c13-66982fa2f67e
Authorization: Bearer {{admin_token}}
```

**Expected**: All events for this specific user

**Demo Point**: ✅ Complete user activity trail for investigations

---

**Query 4: Platform Statistics**

```bash
GET http://localhost:3004/api/audit/stats
Authorization: Bearer {{admin_token}}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "total_events": 1250,
    "by_service": [
      { "service_name": "healthcare-svc", "event_count": 450 },
      { "service_name": "agriculture-svc", "event_count": 380 },
      { "service_name": "urban-svc", "event_count": 320 },
      { "service_name": "auth-svc", "event_count": 100 }
    ],
    "by_event_type": [
      { "event_type": "dpi.healthcare.appointment-booked", "count": 250 },
      { "event_type": "dpi.urban.grievance-submitted", "count": 180 },
      // ...
    ]
  }
}
```

**Demo Point**: ✅ Analytics for platform usage monitoring

---

**Query 5: Date Range Filter**

```bash
GET http://localhost:3004/api/audit/logs?from_date=2026-01-17&to_date=2026-01-18&limit=100
Authorization: Bearer {{admin_token}}
```

**Expected**: Events from last 24 hours

**Demo Point**: ✅ Time-based queries for compliance audits

---

## 🔒 Security Demonstration

**Test 1: Citizen Cannot View Audit Logs**

```bash
GET http://localhost:3004/api/audit/logs
Authorization: Bearer {{citizen_token}}
```

**Expected**: `403 Forbidden`

**Demo Point**: ✅ Only admins can access sensitive audit data

---

**Test 2: Unauthenticated Access Denied**

```bash
GET http://localhost:3004/api/audit/logs
# No Authorization header
```

**Expected**: `401 Unauthorized`

**Demo Point**: ✅ Authentication required for all audit endpoints

---

## 📊 Data Flow Architecture

```
┌─────────────────┐
│  Healthcare     │──┐
│  Agriculture    │──┤
│  Urban Services │──┼──> Kafka Topics ──> Audit Consumer ──> ClickHouse
│  Auth Service   │──┘
└─────────────────┘

                                                              ┌──────────────┐
                                                              │  Audit API   │
                                                              │  (Admin Only)│
                                                              └──────────────┘
                                                                     │
                                                                     ▼
                                                              Query Audit Logs
```

**Key Points**:
1. **Asynchronous**: Services publish events without waiting
2. **Decoupled**: Services don't know about audit service
3. **Reliable**: Kafka ensures no event loss
4. **Fast**: ClickHouse optimized for analytics
5. **Secure**: Admin-only access to sensitive data

---

## 🎭 Judge Demo Script

**Minute 0-1: Introduction**
> "Our platform has comprehensive audit logging for compliance. Every user action across all services is automatically captured via Kafka and stored in ClickHouse with 90-day retention. Only platform admins can access this data."

**Minute 1-3: Generate Events**
> "Let me show you live event generation. I'll book an appointment... [make API call]. Now apply for a farming scheme... [make API call]. And submit a grievance... [make API call]. All these actions are being captured automatically."

**Minute 3-5: View All Logs**
> "As a platform admin, I can now view the audit trail... [GET /audit/logs]. Here are all 3 events we just created, with full details including user ID, timestamp, and event data."

**Minute 5-7: Filter by Event Type**
> "I can filter by specific event types for compliance reporting... [GET /audit/logs/event/dpi.healthcare.appointment-booked]. This is crucial for healthcare audits where we need to track all patient bookings."

**Minute 7-8: Track User Activity**
> "For investigations, I can see complete user activity... [GET /audit/logs/user/:userId]. This shows everything this user has done across all services."

**Minute 8-9: Platform Statistics**
> "For monitoring, we have analytics... [GET /audit/stats]. This shows platform usage across all services and event types."

**Minute 9-10: Security**
> "And critically, this is admin-only. If a citizen tries to access... [use citizen token]... 403 Forbidden. The platform protects sensitive audit data."

---

## 📝 Compliance Features

### ✅ What Makes This Production-Ready

1. **Immutable Logs**: ClickHouse is append-only
2. **Complete Trail**: Every API call logged
3. **User Attribution**: All events linked to user ID
4. **Time-Series**: Optimized for time-based queries
5. **High Performance**: ClickHouse handles millions of events
6. **Retention Policy**: 90-day automatic cleanup
7. **RBAC Protection**: Admin-only access
8. **Correlation IDs**: Track requests across services
9. **Event Sourcing**: Full event history
10. **Analytics Ready**: Statistics and reporting

---

## 🧪 Postman Collection Tests

### Test Suite: Audit Service

**Test 1: Admin Can View Logs**
```javascript
pm.test("Admin can view audit logs", function() {
  pm.response.to.have.status(200);
  pm.expect(pm.response.json().success).to.be.true;
  pm.expect(pm.response.json().data).to.be.an('array');
});
```

**Test 2: Citizen Cannot View Logs**
```javascript
pm.test("Citizen cannot view audit logs", function() {
  pm.response.to.have.status(403);
});
```

**Test 3: Filter by Event Type Works**
```javascript
pm.test("Event type filter works", function() {
  const data = pm.response.json().data;
  data.forEach(log => {
    pm.expect(log.event_type).to.include("dpi.healthcare");
  });
});
```

**Test 4: User Activity Filter Works**
```javascript
pm.test("User activity filter works", function() {
  const userId = pm.environment.get("user_id");
  const data = pm.response.json().data;
  data.forEach(log => {
    pm.expect(log.user_id).to.equal(userId);
  });
});
```

---

## 🔧 Database Queries (Direct ClickHouse)

### Verify Events in ClickHouse

```bash
docker exec -it ingenium-clickhouse clickhouse-client --query "
SELECT
  event_type,
  service_name,
  user_id,
  timestamp,
  event_data
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 10;
"
```

### Count Events by Type

```bash
docker exec -it ingenium-clickhouse clickhouse-client --query "
SELECT
  event_type,
  COUNT(*) as event_count
FROM audit_logs
GROUP BY event_type
ORDER BY event_count DESC;
"
```

### User Activity Summary

```bash
docker exec -it ingenium-clickhouse clickhouse-client --query "
SELECT
  user_id,
  service_name,
  COUNT(*) as action_count
FROM audit_logs
WHERE user_id IS NOT NULL
GROUP BY user_id, service_name
ORDER BY action_count DESC;
"
```

---

## 💡 Key Selling Points for Judges

1. **Automatic**: No manual logging, events captured via Kafka
2. **Complete**: Every action across all 4 services tracked
3. **Secure**: Admin-only access with RBAC
4. **Performant**: ClickHouse handles millions of events
5. **Compliant**: 90-day retention for govt regulations
6. **Queryable**: Filter by event, user, time, service
7. **Analytics**: Platform usage statistics
8. **Immutable**: Audit trail cannot be tampered
9. **Scalable**: Kafka + ClickHouse proven at scale
10. **Production-Ready**: Used by companies like Uber, Cloudflare

---

## 🎯 Expected Questions & Answers

**Q: How do you ensure audit logs aren't lost?**
A: Kafka provides durability and replication. Events are persisted and replayed if audit service goes down.

**Q: Can logs be tampered with?**
A: No. ClickHouse is append-only. Admin access is required and those actions are also audited.

**Q: How do you handle scale?**
A: ClickHouse is built for analytics at scale. It's used by companies processing billions of events daily.

**Q: What about data privacy?**
A: Audit logs are admin-only via RBAC. PII is masked in logs. 90-day retention ensures compliance.

**Q: How do you query old events?**
A: ClickHouse is optimized for time-series queries. Date range filtering is extremely fast.

---

## ✅ Demo Checklist

Before presenting to judges:

- [ ] Generate 5+ events across different services
- [ ] Verify events appear in audit logs
- [ ] Test all filter queries (event type, user ID, date range)
- [ ] Confirm statistics endpoint works
- [ ] Test RBAC (citizen gets 403)
- [ ] Check ClickHouse has data (direct query)
- [ ] Prepare correlation ID for cross-service tracking
- [ ] Have admin token ready
- [ ] Services running: Kafka, ClickHouse, Audit
- [ ] Know your event type names by heart

---

## 🚀 Quick Commands for Demo

```bash
# 1. Generate healthcare event
curl -X POST http://localhost:3010/api/appointments \
  -H "Authorization: Bearer $CITIZEN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doctorId":"xxx","hospitalId":"xxx","appointmentDate":"2026-02-15"}'

# 2. View audit logs
curl http://localhost:3004/api/audit/logs?limit=10 \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 3. Filter healthcare events
curl http://localhost:3004/api/audit/logs/event/dpi.healthcare.appointment-booked \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 4. Get statistics
curl http://localhost:3004/api/audit/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 5. Test security (should fail)
curl http://localhost:3004/api/audit/logs \
  -H "Authorization: Bearer $CITIZEN_TOKEN"
```

---

**Ready to impress! 🏆**

The audit service demonstrates enterprise-grade compliance, security, and scalability - key requirements for government platforms.
