# Admin Access Control Verification

## 🛡️ **ADMIN-ONLY OPERATIONS - COMPLETE VERIFICATION**

This document verifies that admin operations are ONLY accessible to users with `PLATFORM_ADMIN` role.

---

## **Backend Protection Layers**

### **Layer 1: Guard at Controller Level**

All admin endpoints are protected with `@AdminOnly()` decorator:

```typescript
// libs/common/src/decorators/admin-only.decorator.ts
export function AdminOnly() {
    return applyDecorators(
        UseGuards(JwtAuthGuard, RolesGuard),
        Roles(UserRole.PLATFORM_ADMIN),  // ✅ REQUIRES PLATFORM_ADMIN
    );
}
```

### **Layer 2: PreventAdminAsUser Guard**

Admins are BLOCKED from citizen services:

```typescript
// libs/common/src/guards/prevent-admin-as-user.guard.ts
export class PreventAdminAsUserGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const user = request.user as CurrentUser;

        if (user && user.roles.includes(UserRole.PLATFORM_ADMIN)) {
            throw new ForbiddenException('Admins cannot access citizen services directly');
        }

        return true;
    }
}
```

### **Layer 3: API Gateway Route Enforcement**

```typescript
// apps/api-gateway/src/modules/proxy/proxy.controller.ts
@All(':serviceName/admin/*')
async proxyAdminRequest(...) {
    const user = (req as any).user as CurrentUser | undefined;

    // ✅ Verify admin role at gateway level
    if (!user || !user.roles.includes(UserRole.PLATFORM_ADMIN)) {
        throw new ForbiddenException('Admin access required');
    }

    return this.handleProxyRequest(serviceName, `admin/${adminPath}`, req, res);
}
```

---

## **✅ WHAT ADMINS CAN DO**

### **Healthcare Service**
```typescript
// apps/healthcare-svc/src/modules/admin-appointments/admin-appointments.controller.ts
@Controller('admin/appointments')
export class AdminAppointmentsController {
    @Get()
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    findAll() { ... }

    @Get(':id')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    findOne() { ... }

    @Put(':id/status')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    updateStatus() { ... }

    @Delete(':id')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    cancel() { ... }
}
```

**Admin Endpoints:**
- ✅ GET `/api/services/healthcare/admin/appointments` - View all appointments
- ✅ GET `/api/services/healthcare/admin/appointments/:id` - View appointment details
- ✅ PUT `/api/services/healthcare/admin/appointments/:id/status` - Update status
- ✅ DELETE `/api/services/healthcare/admin/appointments/:id` - Cancel appointment
- ✅ GET `/api/services/healthcare/admin/appointments/stats` - View statistics

### **Agriculture Service**
```typescript
// apps/agriculture-svc/src/modules/admin-schemes/admin-schemes.controller.ts
@Controller('admin/schemes')
export class AdminSchemesController {
    @Post()
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    createScheme() { ... }

    @Put(':id')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    updateScheme() { ... }

    @Delete(':id')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    deleteScheme() { ... }

    @Get('applications')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    findAllApplications() { ... }

    @Put('applications/:id/status')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    updateApplicationStatus() { ... }
}
```

**Admin Endpoints:**
- ✅ POST `/api/services/agriculture/admin/schemes` - Create scheme
- ✅ PUT `/api/services/agriculture/admin/schemes/:id` - Update scheme
- ✅ DELETE `/api/services/agriculture/admin/schemes/:id` - Delete scheme
- ✅ GET `/api/services/agriculture/admin/schemes/applications` - View all applications
- ✅ PUT `/api/services/agriculture/admin/schemes/applications/:id/status` - Approve/reject
- ✅ GET `/api/services/agriculture/admin/schemes/stats` - View statistics

### **Urban Service**
```typescript
// apps/urban-svc/src/modules/admin-grievances/admin-grievances.controller.ts
@Controller('admin/grievances')
export class AdminGrievancesController {
    @Get()
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    findAll() { ... }

    @Put(':id/status')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    updateStatus() { ... }

    @Put(':id/assign')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    assign() { ... }
}
```

**Admin Endpoints:**
- ✅ GET `/api/services/urban/admin/grievances` - View all grievances
- ✅ GET `/api/services/urban/admin/grievances/:id` - View grievance details
- ✅ PUT `/api/services/urban/admin/grievances/:id/status` - Update status
- ✅ PUT `/api/services/urban/admin/grievances/:id/assign` - Assign to department
- ✅ PUT `/api/services/urban/admin/grievances/:id/priority` - Change priority
- ✅ GET `/api/services/urban/admin/grievances/stats` - View statistics

### **Analytics Service**
```typescript
// apps/analytics-svc/src/modules/analytics/analytics.controller.ts
@Controller('admin/analytics')
export class AnalyticsController {
    @Get('overview')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    getDashboardStats() { ... }

    @Get('trends')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    getTrends() { ... }

    @Get('service-health')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    getServiceHealth() { ... }
}
```

**Admin Endpoints:**
- ✅ GET `/api/services/analytics/admin/analytics/overview` - Dashboard stats
- ✅ GET `/api/services/analytics/admin/analytics/trends` - Activity trends
- ✅ GET `/api/services/analytics/admin/analytics/service-health` - Service health

### **Audit Service**
```typescript
// apps/audit-svc/src/modules/audit/audit.controller.ts
@Controller('audit')
export class AuditController {
    @Get('logs')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    findAll() { ... }

    @Get('logs/user/:userId')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    findByUser() { ... }

    @Get('stats')
    @AdminOnly()  // ✅ PLATFORM_ADMIN only
    getStats() { ... }
}
```

**Admin Endpoints:**
- ✅ GET `/api/services/audit/audit/logs` - View audit logs
- ✅ GET `/api/services/audit/audit/logs/user/:userId` - View user activity
- ✅ GET `/api/services/audit/audit/stats` - View statistics

---

## **❌ WHAT ADMINS CANNOT DO**

### **Healthcare Service - Citizen Endpoints**
```typescript
// apps/healthcare-svc/src/modules/appointments/appointments.controller.ts
@UseGuards(PreventAdminAsUserGuard)  // ✅ Blocks PLATFORM_ADMIN
@Controller('appointments')
export class AppointmentsController {
    @Post()
    create() { ... }  // ❌ Admin BLOCKED from booking

    @Get('me')
    findMyAppointments() { ... }  // ❌ Admin BLOCKED

    @Put(':id/cancel')
    cancel() { ... }  // ❌ Admin BLOCKED
}
```

**Blocked Citizen Endpoints:**
- ❌ POST `/api/services/healthcare/appointments` - **ADMIN CANNOT BOOK APPOINTMENTS**
- ❌ GET `/api/services/healthcare/appointments/me` - **ADMIN BLOCKED**
- ❌ PUT `/api/services/healthcare/appointments/:id/cancel` - **ADMIN BLOCKED**

### **Agriculture Service - Citizen Endpoints**
```typescript
// apps/agriculture-svc/src/modules/schemes/schemes.controller.ts
@UseGuards(PreventAdminAsUserGuard)  // ✅ Blocks PLATFORM_ADMIN
@Controller('schemes')
export class SchemesController {
    @Post(':id/apply')
    apply() { ... }  // ❌ Admin BLOCKED from applying

    @Get('me/applications')
    findMyApplications() { ... }  // ❌ Admin BLOCKED
}
```

**Blocked Citizen Endpoints:**
- ❌ POST `/api/services/agriculture/schemes/:id/apply` - **ADMIN CANNOT APPLY FOR SCHEMES**
- ❌ GET `/api/services/agriculture/schemes/me/applications` - **ADMIN BLOCKED**

### **Urban Service - Citizen Endpoints**
```typescript
// apps/urban-svc/src/modules/grievances/grievances.controller.ts
@UseGuards(PreventAdminAsUserGuard)  // ✅ Blocks PLATFORM_ADMIN
@Controller('grievances')
export class GrievancesController {
    @Post()
    create() { ... }  // ❌ Admin BLOCKED from submitting

    @Get('me')
    findMyGrievances() { ... }  // ❌ Admin BLOCKED
}
```

**Blocked Citizen Endpoints:**
- ❌ POST `/api/services/urban/grievances` - **ADMIN CANNOT SUBMIT GRIEVANCES**
- ❌ GET `/api/services/urban/grievances/me` - **ADMIN BLOCKED**
- ❌ PUT `/api/services/urban/grievances/:id/escalate` - **ADMIN BLOCKED**

---

## **Frontend Protection**

### **Admin Guard Component**
```typescript
// components/guards/AdminGuard.tsx
export function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, isLoading } = useAdminCheck();

  if (isLoading) return <AdminGuardLoading />;
  if (!isAdmin) return <AdminGuardUnauthorized />;  // ✅ Shows access denied

  return <>{children}</>;
}
```

### **useAdminCheck Hook**
```typescript
// lib/hooks/useAdminCheck.ts
export function useAdminCheck() {
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login?redirect=/admin/dashboard');  // ✅ Redirect to login
      return;
    }

    if (!user.roles.includes(UserRole.PLATFORM_ADMIN)) {
      router.push('/dashboard');  // ✅ Redirect to citizen dashboard
      return;
    }
  }, [user, isAuthenticated, isLoading, router]);
}
```

### **Admin Layout Protection**
```typescript
// app/(admin)/layout.tsx
if (user && !user.roles.includes(UserRole.PLATFORM_ADMIN)) {
  router.push('/dashboard');  // ✅ Redirect non-admins
  return;
}
```

### **Admin Dashboard Protection**
```typescript
// app/(admin)/admin/dashboard/page.tsx
export default function DashboardPage() {
    return (
        <AdminGuard>  {/* ✅ Wraps entire page */}
            <DashboardContent />
        </AdminGuard>
    );
}
```

---

## **Testing Admin Access Control**

### **Test 1: Admin Cannot Book Appointment**
```bash
# Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dpi.com","password":"..."}'

# Try to book appointment (should fail with 403)
curl -X POST http://localhost:3000/api/services/healthcare/appointments \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doctorId":"...","date":"2026-01-20","time":"10:00"}'

# Expected Response:
# {
#   "statusCode": 403,
#   "message": "Admins cannot access citizen services directly",
#   "error": "Forbidden"
# }
```

### **Test 2: Admin Can View All Appointments**
```bash
# Admin can view all appointments via admin endpoint
curl -X GET http://localhost:3000/api/services/healthcare/admin/appointments \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected Response:
# {
#   "data": [...all appointments...],
#   "meta": { "page": 1, "limit": 10, "total": 50 }
# }
```

### **Test 3: Citizen Cannot Access Admin Dashboard**
```bash
# Login as citizen
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"citizen@example.com","password":"..."}'

# Try to access admin analytics (should fail with 403)
curl -X GET http://localhost:3000/api/services/analytics/admin/analytics/overview \
  -H "Authorization: Bearer $CITIZEN_TOKEN"

# Expected Response:
# {
#   "statusCode": 403,
#   "message": "Admin access required",
#   "error": "Forbidden"
# }
```

### **Test 4: Frontend Admin Page Access**
1. Login as citizen at `http://localhost:3000/login`
2. Try to access `http://localhost:3000/admin/dashboard`
3. **Expected**: Redirected to `/dashboard` (citizen dashboard)
4. **Expected**: See "Access Denied" message if redirect doesn't work

---

## **Summary: Admin-Only Operations ✅**

### **Protection Mechanisms**

1. **Backend Guards** ✅
   - `@AdminOnly()` decorator on all admin endpoints
   - `PreventAdminAsUserGuard` on all citizen endpoints
   - API Gateway route-level checks

2. **Frontend Guards** ✅
   - `AdminGuard` component wrapping admin pages
   - `useAdminCheck` hook with automatic redirects
   - Layout-level role verification

3. **Type Safety** ✅
   - `UserRole` enum prevents string typos
   - TypeScript enforces role checks

### **What This Means**

✅ **Admin can ONLY:**
- View dashboard with analytics
- Manage appointments (view, update status, cancel)
- Manage schemes (create, update, delete)
- Manage applications (approve, reject, disburse)
- Manage grievances (view, assign, update status)
- View audit logs
- Monitor service health

❌ **Admin CANNOT:**
- Book appointments as a patient
- Apply for agricultural schemes
- Submit grievances as a citizen
- Access "My Appointments/Applications/Grievances" endpoints
- Use any citizen-facing functionality

✅ **Citizen can ONLY:**
- Book appointments
- Apply for schemes
- Submit grievances
- View their own data

❌ **Citizen CANNOT:**
- Access admin dashboard
- View other citizens' data
- Approve/reject applications
- Manage platform operations

---

## **Verification Checklist**

- [x] Backend: `@AdminOnly()` on all admin controllers
- [x] Backend: `PreventAdminAsUserGuard` on all citizen controllers
- [x] Backend: API Gateway enforces admin routes
- [x] Backend: No `DEPARTMENT_ADMIN` role exists
- [x] Frontend: `AdminGuard` on admin pages
- [x] Frontend: `useAdminCheck` hook redirects non-admins
- [x] Frontend: Layout checks `UserRole.PLATFORM_ADMIN`
- [x] Frontend: No magic strings, uses enum
- [x] Testing: Admin blocked from citizen endpoints (403)
- [x] Testing: Citizen blocked from admin endpoints (403)
- [x] Testing: Frontend redirects work correctly

---

**✅ ADMIN-ONLY OPERATIONS ARE PROPERLY ENFORCED AT ALL LAYERS**
