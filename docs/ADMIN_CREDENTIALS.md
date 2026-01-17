# Admin User Credentials

## Admin Account Details

- **Email**: `admin@dpi.com`
- **Mobile**: `+919999999999`
- **Full Name**: Platform Admin
- **Role**: PLATFORM_ADMIN
- **User ID**: `ff41e714-f8d1-41c5-ae3b-601c7aec982b`

---

## How to Login as Admin

### Method 1: Mobile OTP (Recommended for Testing)

**Step 1: Send OTP**
```http
POST {{gateway_url}}/auth/otp/send
Content-Type: application/json

{
  "mobile": "+919999999999"
}
```

**Step 2: Check OTP in Console**
The OTP will be printed in the **auth-svc** console logs:
```
[OTP] Mobile: +919999999999, Code: 123456
```

**Step 3: Verify OTP**
```http
POST {{gateway_url}}/auth/otp/verify
Content-Type: application/json

{
  "mobile": "+919999999999",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "ff41e714-f8d1-41c5-ae3b-601c7aec982b",
      "email": "admin@dpi.com",
      "mobile": "+919999999999",
      "name": "Platform Admin",
      "roles": ["PLATFORM_ADMIN"]
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

**Step 4: Save Admin Token**
Copy the `accessToken` and set it as `admin_access_token` in your Postman environment.

---

### Method 2: Google OAuth (If Configured)

```http
GET {{gateway_url}}/auth/google/login?email=admin@dpi.com
```

This will redirect to Google OAuth flow and link the account.

---

## Using Admin Token in Postman

### 1. Set Environment Variable

After getting the access token from OTP verification:

1. Go to Postman Environment
2. Set `admin_access_token` = `<your-access-token>`
3. Use `{{admin_access_token}}` in Authorization headers

### 2. Test Admin Privileges

Run these requests to verify admin access:

#### ✅ Create Hospital
```http
POST {{gateway_url}}/services/healthcare/hospitals
Authorization: Bearer {{admin_access_token}}
Content-Type: application/json

{
  "name": "Apollo Hospital",
  "city": "Bangalore",
  "state": "Karnataka",
  "type": "private",
  "totalBeds": 500,
  "availableBeds": 150
}
```

#### ✅ Register Service
```http
POST {{registry_url}}/registry/services
Authorization: Bearer {{admin_access_token}}
Content-Type: application/json

{
  "name": "education",
  "displayName": "Education Services",
  "baseUrl": "http://localhost:3013",
  "healthEndpoint": "/api/health",
  "version": "1.0.0"
}
```

#### ✅ View Audit Logs
```http
GET {{audit_url}}/audit/logs?limit=50
Authorization: Bearer {{admin_access_token}}
```

#### ✅ Delete Hospital
```http
DELETE {{gateway_url}}/services/healthcare/hospitals/{hospital_id}
Authorization: Bearer {{admin_access_token}}
```

---

## Admin Capabilities

With PLATFORM_ADMIN role, you can:

### Healthcare Service
- ✅ Create hospitals
- ✅ Update hospitals
- ✅ Delete hospitals (PLATFORM_ADMIN only)
- ✅ Create doctors
- ✅ Update doctors
- ✅ Delete doctors (PLATFORM_ADMIN only)
- ✅ Manage doctor time slots
- ✅ View all appointments

### Service Registry
- ✅ Register new services
- ✅ Update service details
- ✅ Change service status (ACTIVE/INACTIVE/MAINTENANCE)
- ✅ Delete services

### Audit Service
- ✅ View all audit logs
- ✅ Filter logs by event type
- ✅ Track user activity
- ✅ View platform statistics

### Agriculture Service
- ✅ Create advisories
- ✅ Manage schemes
- ✅ Update market prices
- ✅ Review applications

### Urban Service
- ✅ Manage grievance categories
- ✅ View all grievances
- ✅ Assign grievances to officers
- ✅ Update grievance status

---

## Quick Test Flow

### 1. Login and Get Admin Token

```bash
# In Postman
1. Run: Authentication → Send OTP
   Body: { "mobile": "+919999999999" }

2. Check auth-svc console for OTP (usually 123456 in dev)

3. Run: Authentication → Verify OTP
   Body: { "mobile": "+919999999999", "otp": "123456" }

4. Copy accessToken from response

5. Set admin_access_token in Postman environment
```

### 2. Test Admin Powers

```bash
# Run these from "Service Registry" folder
1. Register Service → Should succeed (201 Created)

# Run these from "Healthcare Service → Hospitals" folder
2. Create Hospital → Should succeed (201 Created)

# Run these from "Audit Service" folder
3. Get All Audit Logs → Should succeed (200 OK)
```

### 3. Verify Security

```bash
# Change to regular citizen token
1. Set Authorization: Bearer {{access_token}}

# Try admin operations
2. Create Hospital → Should FAIL (403 Forbidden)
3. Register Service → Should FAIL (403 Forbidden)
4. View Audit Logs → Should FAIL (403 Forbidden)
```

---

## Regular Citizen Account (For Comparison)

To test the difference between admin and citizen:

**Create Regular Citizen**:
```http
POST {{gateway_url}}/auth/otp/send
Content-Type: application/json

{
  "mobile": "+919876543210"
}
```

This creates a CITIZEN role user automatically.

**Citizen Capabilities**:
- ❌ Cannot create hospitals
- ❌ Cannot create doctors
- ❌ Cannot register services
- ❌ Cannot view audit logs
- ✅ Can browse hospitals/doctors
- ✅ Can book appointments
- ✅ Can apply for schemes
- ✅ Can submit grievances

---

## Troubleshooting

### Issue: "Invalid credentials"
**Fix**: Make sure you're using the OTP from auth-svc console logs (default: 123456)

### Issue: "403 Forbidden" when using admin token
**Fix**:
1. Verify token is set correctly in Postman environment
2. Check token hasn't expired (15 min default)
3. Verify you're using `admin_access_token` not `access_token`

### Issue: "User not found"
**Fix**: Run the database creation command again:
```sql
docker exec ingenium-postgres psql -U postgres -d ingenium_auth -c "
SELECT * FROM users WHERE email = 'admin@dpi.com';
"
```

### Issue: Token expired
**Fix**: Re-authenticate and get new token (tokens expire after 15 minutes)

---

## Security Notes

1. **Development Only**: This admin account is for development/demo purposes
2. **Change in Production**: Use proper admin provisioning in production
3. **Token Expiry**: Access tokens expire after 15 minutes (configurable via JWT_EXPIRES_IN)
4. **Refresh Tokens**: Use refresh token endpoint to get new access tokens

---

## Database Commands

### View Admin User
```bash
docker exec ingenium-postgres psql -U postgres -d ingenium_auth -c "
SELECT id, email, mobile, full_name, roles, email_verified, mobile_verified
FROM users
WHERE email = 'admin@dpi.com';
"
```

### Update Admin Roles
```bash
docker exec ingenium-postgres psql -U postgres -d ingenium_auth -c "
UPDATE users
SET roles = 'PLATFORM_ADMIN,DEPARTMENT_ADMIN'
WHERE email = 'admin@dpi.com';
"
```

### Delete Admin User (if needed)
```bash
docker exec ingenium-postgres psql -U postgres -d ingenium_auth -c "
DELETE FROM users WHERE email = 'admin@dpi.com';
"
```

---

## Quick Copy-Paste for Demo

**Admin Login (Postman)**:
```json
// Send OTP
POST http://localhost:3000/api/auth/otp/send
{ "mobile": "+919999999999" }

// Verify OTP (check console for code)
POST http://localhost:3000/api/auth/otp/verify
{ "mobile": "+919999999999", "otp": "123456" }
```

**Test Admin Access**:
```json
// Create Hospital (Admin Only)
POST http://localhost:3000/api/services/healthcare/hospitals
Authorization: Bearer {{admin_access_token}}
{
  "name": "City Hospital",
  "city": "Bangalore",
  "state": "Karnataka",
  "type": "government"
}

// View Audit Logs (Admin Only)
GET http://localhost:3007/api/audit/logs
Authorization: Bearer {{admin_access_token}}
```

---

## Success Indicators

When logged in as admin, you should see:

```json
{
  "user": {
    "roles": ["PLATFORM_ADMIN"],
    "email": "admin@dpi.com",
    "mobile": "+919999999999"
  }
}
```

**JWT Payload** (decoded):
```json
{
  "sub": "ff41e714-f8d1-41c5-ae3b-601c7aec982b",
  "email": "admin@dpi.com",
  "mobile": "+919999999999",
  "name": "Platform Admin",
  "roles": ["PLATFORM_ADMIN"],
  "iat": 1234567890,
  "exp": 1234568790
}
```

---

## Ready to Demo! 🚀

You now have:
- ✅ Admin account created
- ✅ PLATFORM_ADMIN role assigned
- ✅ Full access to all admin operations
- ✅ Both email and mobile authentication enabled

Use mobile `+919999999999` to login and start testing admin features!
