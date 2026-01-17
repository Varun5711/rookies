import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT Authentication Guard
 * Unlike JwtAuthGuard, this guard:
 * 1. ALWAYS allows the request through
 * 2. Attempts to extract and validate JWT if present
 * 3. Sets request.user if token is valid
 * 4. Does NOT throw if token is missing or invalid
 *
 * Used for dynamic service routing where auth is checked manually
 * based on service.isPublic and service.requiredRoles
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Always allow request through, but try to authenticate
   */
  canActivate(context: ExecutionContext) {
    // Try to authenticate, but don't fail if it doesn't work
    return super.canActivate(context);
  }

  /**
   * Handle authentication result
   * Unlike the default, we don't throw on missing/invalid token
   */
  handleRequest(err: any, user: any, _info: any) {
    // If there's an error or no user, just return null
    // The request will proceed, but without user context
    if (err || !user) {
      return null;
    }
    return user;
  }
}
