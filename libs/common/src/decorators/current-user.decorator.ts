import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser as ICurrentUser } from '../interfaces/current-user.interface';

/**
 * Current User Decorator
 * Extracts the authenticated user from the request object
 *
 * Usage:
 * ```typescript
 * @Get('/profile')
 * getProfile(@CurrentUser() user: CurrentUser) {
 *   return user;
 * }
 * ```
 *
 * The user object is populated by the JWT auth guard after token validation
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ICurrentUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
