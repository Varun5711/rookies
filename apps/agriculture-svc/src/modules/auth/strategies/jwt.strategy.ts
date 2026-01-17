import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CurrentUser } from '@dpi/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key',
    });
  }

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
