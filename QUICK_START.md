# Quick Start - Admin Login & Testing

## ⚠️ Current Status

**Working**:
- ✅ Auth service direct: `http://localhost:3001/api`
- ✅ Service Registry: `http://localhost:3002/api`
- ✅ Audit service: `http://localhost:3004/api`
- ✅ Healthcare service: `http://localhost:3010/api`
- ✅ Admin user created in database

**Issue**:
- ⚠️ Gateway routing has NestJS wildcard pattern issue
- **Workaround**: Use direct service URLs instead of gateway for now

---

## 🔑 Admin Login (3 Steps)

### Step 1: Send OTP (Use Your Real Number)

```bash
# Replace with your actual mobile number (10 digits)
curl -X POST http://localhost:3001/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "YOUR_NUMBER"}'
```

**Example**:
```bash
curl -X POST http://localhost:3001/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "8758830100"}'
```

**Response**:
```json
{"success":true,"message":"OTP sent successfully","expiresIn":300}
```

### Step 2: Check Your Phone for OTP

You'll receive an SMS with a 6-digit OTP code.

### Step 3: Verify OTP & Get Token

```bash
curl -X POST http://localhost:3001/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "YOUR_NUMBER", "otp": "YOUR_OTP"}'
```

**Example**:
```bash
curl -X POST http://localhost:3001/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "8758830100", "otp": "654321"}'
```

**Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "id": "uuid",
    "mobile": "8758830100",
    "fullName": "User Name",
    "roles": ["CITIZEN"]
  },
  "tokens": {
    "accessToken": "eyJhbGc...",  // COPY THIS!
    "refreshToken": "eyJhbGc..."
  }
}
```

### Step 4: Update User to Admin

```bash
# Update your mobile number's user to PLATFORM_ADMIN
docker exec ingenium-postgres psql -U postgres -d ingenium_auth -c "
UPDATE users
SET roles = 'PLATFORM_ADMIN',
    email = 'admin@dpi.com',
    full_name = 'Platform Admin'
WHERE mobile = 'YOUR_NUMBER';
"
```

**Example**:
```bash
docker exec ingenium-postgres psql -U postgres -d ingenium_auth -c "
UPDATE users
SET roles = 'PLATFORM_ADMIN',
    email = 'admin@dpi.com',
    full_name = 'Platform Admin'
WHERE mobile = '8758830100';
"
```

### Step 5: Login Again as Admin

Repeat steps 1-3 to get a new token with admin privileges.

---

## 🧪 Test Admin Powers

### 1. Create Hospital (Admin Only)

```bash
curl -X POST http://localhost:3010/api/hospitals \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apollo Hospital",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "address": "MG Road",
    "type": "private",
    "totalBeds": 500,
    "availableBeds": 150
  }'
```

**Expected**: 201 Created ✅

### 2. Register Service (Admin Only)

```bash
curl -X POST http://localhost:3002/api/registry/services \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "education",
    "displayName": "Education Services",
    "baseUrl": "http://localhost:3013",
    "healthEndpoint": "/api/health",
    "version": "1.0.0"
  }'
```

**Expected**: 201 Created ✅

### 3. View Audit Logs (Admin Only)

```bash
curl -X GET http://localhost:3004/api/audit/logs?limit=10 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected**: 200 OK with logs ✅

---

## 📱 Postman Setup

### Update Environment Variables

```
# Direct service URLs (use these instead of gateway)
auth_url = http://localhost:3001/api
registry_url = http://localhost:3002/api
audit_url = http://localhost:3004/api
healthcare_url = http://localhost:3010/api
agriculture_url = http://localhost:3011/api
urban_url = http://localhost:3012/api

# Tokens
access_token = (your access token)
admin_access_token = (your admin access token)
```

### Update Requests

Instead of:
```
{{gateway_url}}/auth/otp/send  ❌
```

Use:
```
{{auth_url}}/otp/send  ✅
```

---

## 🔧 Service Ports Reference

| Service | Port | URL |
|---------|------|-----|
| API Gateway | 3000 | http://localhost:3000/api (⚠️ routing issue) |
| Auth | 3001 | http://localhost:3001/api |
| Service Registry | 3002 | http://localhost:3002/api |
| Healthcare | 3010 | http://localhost:3010/api |
| Agriculture | 3011 | http://localhost:3011/api |
| Urban | 3012 | http://localhost:3012/api |
| Audit | 3004 | http://localhost:3004/api |

---

## 🛠️ Troubleshooting

### Redis Rate Limit Error

If you see: `ERR value is not an integer or out of range`

**Fix**:
```bash
docker exec ingenium-redis redis-cli --scan --pattern "dpi:otp:ratelimit:*" | xargs -r docker exec ingenium-redis redis-cli DEL
```

### OTP Not Received

Check auth-svc logs for the OTP (in development, it's printed to console):
```
[OTP] Mobile: +918758830100, Code: 654321
```

### Twilio Not Configured Error

This is normal in development. Check the console logs for the OTP instead of SMS.

### 403 Forbidden

Make sure:
1. User has PLATFORM_ADMIN role in database
2. You're using the admin token, not citizen token
3. Token hasn't expired (15 min expiry)

---

## ✅ Working Test Flow

### 1. Citizen Login
```bash
# Send OTP
curl -X POST http://localhost:3001/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "8758830100"}'

# Verify OTP (get from SMS or logs)
curl -X POST http://localhost:3001/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "8758830100", "otp": "123456"}'
```

### 2. Browse Public Data
```bash
# List hospitals (no auth required)
curl http://localhost:3010/api/hospitals

# List doctors (no auth required)
curl http://localhost:3010/api/doctors
```

### 3. Admin Operations
```bash
# Create hospital (admin only)
curl -X POST http://localhost:3010/api/hospitals \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "City Hospital", "city": "Bangalore", "state": "Karnataka", "type": "government"}'
```

---

## 🎯 For Hackathon Demo

**Use direct service URLs** instead of gateway:

- Authentication: `http://localhost:3001/api/otp/...`
- Service Registry: `http://localhost:3002/api/registry/...`
- Healthcare: `http://localhost:3010/api/hospitals/...`
- Audit: `http://localhost:3004/api/audit/...`

The RBAC security and all features work perfectly - just bypass the gateway routing issue by calling services directly.

---

## 🚀 Next Steps

1. Login with your mobile number
2. Update yourself to PLATFORM_ADMIN
3. Re-login to get admin token
4. Test admin operations
5. Use direct service URLs in Postman
6. Run RBAC security tests
7. Demo ready! 🎉
