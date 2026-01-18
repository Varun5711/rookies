# Database Migration - Create Admin User

## 🎯 **Purpose**
This migration will:
1. Remove `DEPARTMENT_ADMIN` role (convert to `SERVICE_PROVIDER`)
2. Create the admin user with `PLATFORM_ADMIN` role
3. Set up admin credentials for login

---

## 📋 **Prerequisites**

1. **Ensure Docker containers are running:**
   ```bash
   cd /Users/varunhotani/Desktop/ingenium-2026
   docker-compose -f infra/docker/docker-compose.yml ps
   ```

2. **Verify postgres is healthy:**
   ```bash
   docker ps | grep postgres
   # Should show: ingenium-postgres ... Up (healthy)
   ```

---

## 🚀 **Method 1: Run Migration via Docker (Recommended)**

### **Step 1: Copy migration file into container**
```bash
docker cp migration_phase9.sql ingenium-postgres:/tmp/migration_phase9.sql
```

### **Step 2: Execute migration**
```bash
docker exec -it ingenium-postgres psql -U postgres -d auth -f /tmp/migration_phase9.sql
```

### **Step 3: Verify admin user created**
```bash
docker exec -it ingenium-postgres psql -U postgres -d auth -c "SELECT id, email, roles, full_name FROM users WHERE email = 'admin@dpi.com';"
```

**Expected Output:**
```
                  id                  |     email     |     roles      |      full_name
--------------------------------------+---------------+----------------+-----------------------
 ff41e714-f8d1-41c5-ae3b-601c7aec982b | admin@dpi.com | {PLATFORM_ADMIN} | Platform Administrator
```

---

## 🚀 **Method 2: Run via psql (If psql installed locally)**

```bash
PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -d auth -f migration_phase9.sql
```

---

## 🚀 **Method 3: Interactive SQL (Manual)**

### **Step 1: Connect to database**
```bash
docker exec -it ingenium-postgres psql -U postgres -d auth
```

### **Step 2: Copy and paste the SQL**
```sql
-- Convert DEPARTMENT_ADMIN to SERVICE_PROVIDER
UPDATE users
SET roles = 'SERVICE_PROVIDER'
WHERE roles = 'DEPARTMENT_ADMIN';

-- Handle array-based roles
UPDATE users
SET roles = array_replace(roles::text[], 'DEPARTMENT_ADMIN', 'SERVICE_PROVIDER')
WHERE 'DEPARTMENT_ADMIN' = ANY(roles::text[]);

-- Verify admin user exists
INSERT INTO users (id, email, mobile, roles, full_name, mobile_verified, created_at, updated_at)
VALUES (
  'ff41e714-f8d1-41c5-ae3b-601c7aec982b',
  'admin@dpi.com',
  '+919999999999',
  '{PLATFORM_ADMIN}',
  'Platform Administrator',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET roles = '{PLATFORM_ADMIN}';
```

### **Step 3: Verify**
```sql
SELECT id, email, roles, full_name FROM users WHERE email = 'admin@dpi.com';
```

### **Step 4: Exit**
```sql
\q
```

---

## ✅ **Verification Steps**

### **1. Check admin user in database**
```bash
docker exec -it ingenium-postgres psql -U postgres -d auth -c "SELECT * FROM users WHERE email = 'admin@dpi.com';"
```

### **2. Check no DEPARTMENT_ADMIN roles exist**
```bash
docker exec -it ingenium-postgres psql -U postgres -d auth -c "SELECT COUNT(*) FROM users WHERE 'DEPARTMENT_ADMIN' = ANY(roles::text[]);"
```
**Expected:** `count = 0`

### **3. Test login via API**

**Option A: Send OTP**
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919999999999"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Option B: Check OTP in logs**
```bash
docker logs -f ingenium-auth-svc 2>&1 | grep "OTP"
```

**Option C: Verify OTP**
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "+919999999999",
    "otp": "YOUR_OTP_FROM_LOGS"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "ff41e714-f8d1-41c5-ae3b-601c7aec982b",
    "email": "admin@dpi.com",
    "mobile": "+919999999999",
    "fullName": "Platform Administrator",
    "roles": ["PLATFORM_ADMIN"]
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### **4. Test login via UI**
1. Go to `http://localhost:3000/login`
2. Enter mobile: `+919999999999`
3. Get OTP from auth-svc logs
4. Enter OTP
5. **Expected:** Redirected to `/admin/dashboard`
6. **Expected:** See admin UI (NOT citizen UI)

---

## 🔧 **Troubleshooting**

### **Error: "relation 'users' does not exist"**
**Solution:** Make sure you're connected to the `auth` database:
```bash
docker exec -it ingenium-postgres psql -U postgres -d auth
```

### **Error: "database 'auth' does not exist"**
**Solution:** Create the database first:
```bash
docker exec -it ingenium-postgres psql -U postgres -c "CREATE DATABASE auth;"
```

### **Error: "password authentication failed"**
**Solution:** Use the correct credentials from `.env`:
- Username: `postgres`
- Password: `postgres`

### **Can't find OTP in logs**
**Solution:** Check auth-svc logs:
```bash
# If running via mprocs, check mprocs output
# Or if running standalone:
bunx nx serve auth-svc 2>&1 | grep OTP
```

---

## 📝 **Post-Migration Checklist**

- [ ] Admin user exists in database
- [ ] Admin email is `admin@dpi.com`
- [ ] Admin mobile is `+919999999999`
- [ ] Admin role is `PLATFORM_ADMIN` (array format: `{PLATFORM_ADMIN}`)
- [ ] No `DEPARTMENT_ADMIN` roles remain
- [ ] Can send OTP to admin mobile
- [ ] Can login via UI
- [ ] After login, redirected to `/admin/dashboard`
- [ ] See admin UI (NOT citizen actions)

---

## 🎯 **Admin Login Credentials**

**Mobile:** `+919999999999`
**Email:** `admin@dpi.com`
**Role:** `PLATFORM_ADMIN`
**OTP:** Check auth-svc logs after sending OTP

---

## 🔐 **Security Notes**

1. **OTP-based login:** Admin uses same OTP login as citizens
2. **No password:** Platform uses OTP authentication (no passwords stored)
3. **Role-based routing:** Login automatically detects role and redirects
4. **Google login:** Also works for admin if Google account email matches

---

## ⚡ **Quick Command Reference**

```bash
# Copy migration file
docker cp migration_phase9.sql ingenium-postgres:/tmp/migration_phase9.sql

# Run migration
docker exec -it ingenium-postgres psql -U postgres -d auth -f /tmp/migration_phase9.sql

# Verify admin exists
docker exec -it ingenium-postgres psql -U postgres -d auth -c "SELECT email, roles, full_name FROM users WHERE email = 'admin@dpi.com';"

# Test OTP send
curl -X POST http://localhost:3000/api/auth/send-otp -H "Content-Type: application/json" -d '{"mobile": "+919999999999"}'

# Check auth logs for OTP
docker logs -f auth-svc-container-name 2>&1 | grep OTP
```

---

## ✅ **Done!**

After running the migration, you can login as admin using:
- Mobile: `+919999999999`
- Get OTP from logs
- Will be redirected to `/admin/dashboard`
- Will see admin-only UI

🎉 **Admin user is ready to use!**
