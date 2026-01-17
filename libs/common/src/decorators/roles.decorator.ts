import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

/**
 * Roles Decorator
 * Specifies which roles are required to access an endpoint
 *
 * Usage:
 * ```typescript
 * @Roles(UserRole.PLATFORM_ADMIN)
 * @Delete('/users/:id')
 * deleteUser() {
 *   // Only platform admins can access this
 * }
 *
 * @Roles(UserRole.DEPARTMENT_ADMIN, UserRole.PLATFORM_ADMIN)
 * @Get('/reports')
 * getReports() {
 *   // Department admins and platform admins can access this
 * }
 * ```
 *
 * The RolesGuard will check if the current user has at least one of the specified roles
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
