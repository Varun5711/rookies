import { SetMetadata } from '@nestjs/common';

/**
 * Public Decorator
 * Marks an endpoint as public (no authentication required)
 *
 * Usage:
 * ```typescript
 * @Public()
 * @Get('/public-data')
 * getPublicData() {
 *   return { data: 'This is public' };
 * }
 * ```
 *
 * The JWT auth guard will skip authentication for routes marked with @Public()
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
