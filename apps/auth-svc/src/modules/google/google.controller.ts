import {
  Controller,
  Get,
  Query,
  Res,
  Req,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleService } from './google.service';
import { TokensService } from '../tokens/tokens.service';
import { Public } from '@dpi/common';

/**
 * Google OAuth Controller
 * Handles Google OAuth 2.0 authentication endpoints
 *
 * Endpoints:
 * - GET /auth/google/login - Initiate OAuth flow (redirects to Google)
 * - GET /auth/google/callback - Handle OAuth callback from Google
 */
@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly tokensService: TokensService,
  ) {}

  /**
   * Initiate Google OAuth login
   * Redirects user to Google's consent screen
   *
   * @returns Redirect to Google OAuth URL
   */
  @Public()
  @Get('login')
  async login(@Res() res: Response) {
    const authUrl = await this.googleService.initiateOAuth();
    return res.redirect(authUrl);
  }

  /**
   * Handle Google OAuth callback
   * Receives authorization code from Google, exchanges for user info,
   * creates/updates user, and returns user data
   *
   * In production, this would redirect to frontend with tokens
   * For now, returns JSON response
   *
   * @param code - Authorization code from Google
   * @param state - CSRF protection state
   * @returns User object
   */
  @Public()
  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Validate query parameters
    if (!code || !state) {
      throw new BadRequestException('Missing code or state parameter');
    }

    try {
      // Handle OAuth callback and get user
      const user = await this.googleService.handleCallback(code, state);

      // Generate JWT tokens
      const tokens = await this.tokensService.generateTokens(user, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      // In production: Redirect to frontend with tokens in query params or cookies
      // For now, return JSON response for testing
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Google OAuth successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          picture: user.picture,
          roles: user.roles,
        },
        tokens,
      });
    } catch (error) {
      // In production: Redirect to frontend error page
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message || 'Google OAuth failed',
      });
    }
  }
}
