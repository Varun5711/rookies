import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TokensService } from './tokens.service';
import { Public } from '@dpi/common';

/**
 * Tokens Controller
 * Handles token refresh and logout endpoints
 */
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  /**
   * Refresh access token
   * Uses refresh token to generate new token pair
   *
   * @param body - Refresh token
   * @returns New access token and refresh token
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Req() req: Request
  ) {
    if (!refreshToken) {
      return {
        success: false,
        message: 'Refresh token is required',
      };
    }

    const tokens = await this.tokensService.refreshTokens(refreshToken, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return {
      success: true,
      message: 'Tokens refreshed successfully',
      tokens,
    };
  }

  /**
   * Logout (revoke refresh token)
   *
   * @param body - Refresh token to revoke
   * @returns Success message
   */
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      return {
        success: false,
        message: 'Refresh token is required',
      };
    }

    await this.tokensService.revokeRefreshToken(refreshToken);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
