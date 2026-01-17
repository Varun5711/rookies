import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CurrentUser } from '@dpi/common';

/**
 * JWT Strategy
 * Validates JWT tokens and extracts user payload
 *
 * This strategy:
 * 1. Extracts JWT from Authorization header (Bearer token)
 * 2. Validates token signature using JWT secret
 * 3. Extracts user payload from token
 * 4. Attaches user to request.user
 *
 * The JwtAuthGuard uses this strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    });
  }

  /**
   * Validate JWT payload
   * This method is called after token signature is verified
   * The returned value is attached to request.user
   */
  async validate(payload: any): Promise<CurrentUser> {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      mobile: payload.mobile,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.googleId,
      mobileVerified: payload.mobileVerified,
      roles: payload.roles,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
