import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from '../interfaces/current-user.interface';

/**
 * Get Current User Decorator
 * Extracts the authenticated user from the request object
 *
 * Usage:
 * ```typescript
 * @Get('/profile')
 * getProfile(@GetCurrentUser() user: CurrentUser) {
 *   return user;
 * }
 * ```
 *
 * The user object is populated by the JWT auth guard after token validation
 */
export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
