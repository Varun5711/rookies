import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '@dpi/redis';
import { UsersService } from '../users/users.service';

/**
 * Google OAuth Service
 * Handles Google OAuth 2.0 authentication flow
 *
 * Flow:
 * 1. initiateOAuth() - Generate state, store in Redis, redirect to Google
 * 2. handleCallback() - Validate state, exchange code for token, get user info
 * 3. Create/update user in database
 * 4. Return user and tokens (handled by TokensService)
 */
@Injectable()
export class GoogleService {
  private readonly GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private readonly GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Initiate Google OAuth flow
   * Generates OAuth state for CSRF protection and returns redirect URL
   */
  async initiateOAuth(): Promise<string> {
    // Generate unique state for CSRF protection
    const state = uuidv4();

    // Store state in Redis with 5 minute TTL
    await this.redisService.set(`oauth:state:${state}`, 'true', 300);

    // Build Google OAuth URL
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: process.env.GOOGLE_CALLBACK_URL || '',
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'offline', // To get refresh token
      prompt: 'consent', // Force consent screen to get refresh token
    });

    return `${this.GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  /**
   * Handle Google OAuth callback
   * Validates state, exchanges code for tokens, and creates/updates user
   */
  async handleCallback(code: string, state: string) {
    // 1. Validate state (CSRF protection)
    const stateValid = await this.redisService.get(`oauth:state:${state}`);
    if (!stateValid) {
      throw new UnauthorizedException('Invalid or expired OAuth state');
    }

    // Delete state after use (one-time use)
    await this.redisService.del(`oauth:state:${state}`);

    // 2. Exchange authorization code for access token
    const tokenData = await this.exchangeCodeForToken(code);

    // 3. Get user info from Google
    const userInfo = await this.getUserInfo(tokenData.access_token);

    // 4. Validate required fields
    if (!userInfo.id || !userInfo.email) {
      throw new BadRequestException('Failed to get user information from Google');
    }

    // 5. Create or update user
    const user = await this.usersService.findOrCreateGoogleUser({
      googleId: userInfo.id,
      email: userInfo.email,
      fullName: userInfo.name || userInfo.email,
      picture: userInfo.picture,
    });

    return user;
  }

  /**
   * Exchange authorization code for access token
   */
  private async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.GOOGLE_TOKEN_URL, {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL,
          grant_type: 'authorization_code',
        })
      );

      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw new UnauthorizedException('Failed to exchange authorization code');
    }
  }

  /**
   * Get user info from Google
   */
  private async getUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.GOOGLE_USERINFO_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      return response.data;
    } catch (error) {
      console.error('Error getting user info:', error.response?.data || error.message);
      throw new UnauthorizedException('Failed to get user information from Google');
    }
  }
}
