# Universal Login - Works for ALL User Types

## ✅ **CONFIRMED: Login Form is Universal**

The login form **DOES NOT** have any toggles or user type selection.

**It works automatically for:**
- ✅ Citizens
- ✅ Service Providers
- ✅ Platform Admins

---

## 🔐 **How It Works**

### **1. User enters mobile number OR uses Google login**
```typescript
// No user type selection required!
// Just enter mobile: +919999999999
```

### **2. Backend looks up user in database**
```sql
SELECT * FROM users WHERE mobile = '+919999999999';
-- OR
SELECT * FROM users WHERE email = 'admin@dpi.com';
```

### **3. Backend returns user with their role(s)**
```json
{
  "user": {
    "id": "...",
    "email": "admin@dpi.com",
    "mobile": "+919999999999",
    "roles": ["PLATFORM_ADMIN"]  // ← Role determined from database
  }
}
```

### **4. Frontend automatically redirects based on role**
```typescript
// dpi-client/app/(auth)/login/page.tsx
if (response.user.roles.includes(UserRole.PLATFORM_ADMIN)) {
  router.push('/admin/dashboard');  // ✅ Admin → admin dashboard
} else {
  router.push('/dashboard');  // ✅ Citizen → citizen dashboard
}
```

---

## 🎯 **Login Flow (All User Types)**

### **Step 1: Enter Mobile**
```
┌─────────────────────────────┐
│  Mobile Number              │
│  [+91 9999999999]          │
│  [Send OTP]                │
└─────────────────────────────┘
```

### **Step 2: Verify OTP**
```
┌─────────────────────────────┐
│  OTP sent to +91 9999999999│
│  [123456]                  │
│  [Verify & Login]          │
└─────────────────────────────┘
```

### **Step 3: Auto-Redirect**

**If roles = ['PLATFORM_ADMIN']:**
```
→ Redirected to: /admin/dashboard
→ Shows: Admin UI (analytics, service management)
```

**If roles = ['CITIZEN']:**
```
→ Redirected to: /dashboard
→ Shows: Citizen UI (book appointment, apply schemes, etc.)
```

**If roles = ['SERVICE_PROVIDER']:**
```
→ Redirected to: /dashboard
→ Shows: Service provider UI (manage appointments, etc.)
```

---

## 🔑 **Login Methods**

### **Method 1: OTP Login (Primary)**
1. Enter mobile number
2. Receive OTP (check auth-svc logs)
3. Enter OTP
4. **Auto-redirect based on role**

### **Method 2: Google OAuth**
1. Click "Continue with Google"
2. Login with Google account
3. Backend matches email to database user
4. **Auto-redirect based on role**

---

## 👥 **Example Users**

### **Admin User**
```
Mobile: +919999999999
Email: admin@dpi.com
Roles: [PLATFORM_ADMIN]
After Login → /admin/dashboard
```

### **Citizen User**
```
Mobile: +919876543210
Email: citizen@example.com
Roles: [CITIZEN]
After Login → /dashboard
```

### **Service Provider User**
```
Mobile: +919123456789
Email: doctor@hospital.com
Roles: [SERVICE_PROVIDER]
After Login → /dashboard (service provider view)
```

---

## ✅ **No User Type Selection Required**

**Login form components:**
```typescript
{step === 'mobile' ? (
  <form>
    <Input label="Mobile Number" />  {/* ← Just mobile, no user type! */}
    <Button>Send OTP</Button>
  </form>
) : (
  <form>
    <Input label="Enter OTP" />
    <Button>Verify & Login</Button>
  </form>
)}
```

**NO toggles for:**
- ❌ "Login as Citizen"
- ❌ "Login as Admin"
- ❌ "Login as Service Provider"
- ❌ User type dropdown
- ❌ Role selection

**Role is determined automatically from the database!**

---

## 🧪 **Testing Different User Types**

### **Test 1: Login as Admin**
```bash
# 1. Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919999999999"}'

# 2. Get OTP from logs
docker logs auth-svc-container | grep OTP

# 3. Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919999999999", "otp": "123456"}'

# Response will have roles: ["PLATFORM_ADMIN"]
# Frontend redirects to: /admin/dashboard
```

### **Test 2: Login as Citizen**
```bash
# Same process, but with citizen mobile number
# Response will have roles: ["CITIZEN"]
# Frontend redirects to: /dashboard
```

---

## 🎨 **UI Design**

**Login page shows:**
```
┌─────────────────────────────────────────────┐
│         Welcome to BharatSetu               │
│    Unified Portal for Government Services  │
├─────────────────────────────────────────────┤
│  Mobile Number                              │
│  [Enter your 10-digit mobile number]       │
│  [Send OTP →]                              │
│                                             │
│  ────────── or continue with ──────────    │
│                                             │
│  [🔵 Continue with Google]                 │
│                                             │
│  ← Back to Home                            │
└─────────────────────────────────────────────┘
```

**NO user type selection visible!**

---

## 🔐 **Security Benefits**

1. **Single Login Flow:** Less complexity, fewer bugs
2. **Role from Database:** Can't fake being admin by selecting user type
3. **Backend Enforced:** Role checking happens server-side
4. **Token Contains Role:** JWT includes role claims
5. **Frontend Validates:** Additional client-side role checks

---

## 📋 **Backend Role Lookup**

```typescript
// apps/auth-svc/src/modules/auth/auth.service.ts
async verifyOtp(mobile: string, otp: string) {
  // 1. Verify OTP
  // 2. Find user in database
  const user = await this.usersRepository.findOne({
    where: { mobile }
  });

  // 3. Return user with their actual roles from database
  return {
    user: {
      id: user.id,
      email: user.email,
      roles: user.roles,  // ← ['PLATFORM_ADMIN'] or ['CITIZEN']
    },
    tokens: { ... }
  };
}
```

---

## ✅ **Summary**

### **Login Form:**
- ✅ **Universal** - Works for all user types
- ✅ **No toggles** - No user type selection
- ✅ **Auto-routing** - Redirects based on database role
- ✅ **Secure** - Backend determines role, not user input

### **After Login:**
- **Admin** → `/admin/dashboard` (admin UI)
- **Citizen** → `/dashboard` (citizen UI)
- **Service Provider** → `/dashboard` (provider UI)

### **Methods:**
- **OTP Login** - Mobile + OTP
- **Google OAuth** - Google account

**The login form is already perfect - it works for everyone without any toggles!** 🎉
