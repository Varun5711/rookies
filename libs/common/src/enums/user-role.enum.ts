/**
 * User Role Enum
 * Defines all possible user roles in the DPI platform
 *
 * Role Hierarchy:
 * - PLATFORM_ADMIN: Full system access
 * - SERVICE_PROVIDER: Service-level access (doctors, agri officers, ward officers)
 * - CITIZEN: End-user access
 */
export enum UserRole {
  CITIZEN = 'citizen',
  SERVICE_PROVIDER = 'service_provider',
  PLATFORM_ADMIN = 'platform_admin',
}
