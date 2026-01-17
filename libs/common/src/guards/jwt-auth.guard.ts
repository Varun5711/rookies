import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JWT Authentication Guard
 * Validates JWT tokens for all routes except those marked with @Public()
 *
 * This guard:
 * 1. Checks if the route is marked as @Public()
 * 2. If not public, validates the JWT token using Passport JWT strategy
 * 3. Extracts user information from token and attaches to request.user
 * 4. Throws UnauthorizedException if token is invalid or missing
 *
 * Usage:
 * Apply globally in main.ts or module:
 * ```typescript
 * app.useGlobalGuards(new JwtAuthGuard(reflector));
 * ```
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Override canActivate to check for @Public() decorator
   */
  canActivate(context: ExecutionContext) {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // For protected routes, call Passport JWT strategy
    return super.canActivate(context);
  }

  /**
   * Override handleRequest to customize error handling
   */
  handleRequest(err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
