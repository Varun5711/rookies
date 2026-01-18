import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { Public } from '@dpi/common';
import {
    SendOtpDto,
    VerifyOtpDto,
    RefreshTokenDto,
    AuthSuccessResponse,
    UserResponse,
    TokensResponse,
} from '../../dto/auth/auth.dto';

/**
 * Auth Gateway Controller
 * Documents authentication endpoints for Swagger UI.
 * NOTE: These endpoints are proxied to auth-svc - no implementation here.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthGatewayController {
    @ApiOperation({
        summary: 'Send OTP to mobile number',
        description: `
Sends a 6-digit OTP to the specified mobile number for authentication.

**Rate Limiting:** 3 OTP requests per 10 minutes per mobile number.

**OTP Validity:** 5 minutes from generation.

**Mobile Format:** 10-digit Indian mobile number starting with 6-9.
    `,
    })
    @ApiBody({ type: SendOtpDto })
    @ApiResponse({
        status: 200,
        description: 'OTP sent successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'OTP sent successfully' },
                        expiresIn: { type: 'number', example: 300 },
                    },
                },
                meta: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'string', example: '2026-01-18T13:00:00.000Z' },
                        requestId: { type: 'string', example: 'uuid-correlation-id' },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Invalid mobile number format' })
    @ApiResponse({ status: 429, description: 'Rate limit exceeded - too many OTP requests' })
    @Public()
    @Post('otp/send')
    @HttpCode(HttpStatus.OK)
    sendOtp(@Body() _dto: SendOtpDto) {
        // Proxied to auth-svc
    }

    @ApiOperation({
        summary: 'Verify OTP and authenticate user',
        description: `
Verifies the OTP sent to the mobile number and returns authentication tokens.

**Returns:**
- Access Token (valid for 15 minutes)
- Refresh Token (valid for 7 days)
- User profile information

**First-time users:** Account is automatically created upon first successful verification.
    `,
    })
    @ApiBody({ type: VerifyOtpDto })
    @ApiResponse({
        status: 200,
        description: 'OTP verified successfully',
        type: AuthSuccessResponse,
    })
    @ApiResponse({ status: 400, description: 'Invalid OTP or expired' })
    @ApiResponse({ status: 401, description: 'OTP verification failed' })
    @Public()
    @Post('otp/verify')
    @HttpCode(HttpStatus.OK)
    verifyOtp(@Body() _dto: VerifyOtpDto) {
        // Proxied to auth-svc
    }

    @ApiOperation({
        summary: 'Initiate Google OAuth login',
        description: `
Redirects the user to Google's OAuth consent screen.

**Flow:**
1. User is redirected to Google
2. User grants permissions
3. Google redirects back to callback URL with authorization code
4. Tokens are returned to the client

**Note:** This endpoint returns a redirect (302), not JSON.
    `,
    })
    @ApiResponse({
        status: 302,
        description: 'Redirects to Google OAuth consent screen',
    })
    @Public()
    @Get('google/login')
    googleLogin() {
        // Proxied to auth-svc
    }

    @ApiOperation({
        summary: 'Google OAuth callback',
        description: `
Handles the callback from Google OAuth after user grants permission.

**Returns:**
- Access Token (valid for 15 minutes)
- Refresh Token (valid for 7 days)
- User profile information (including Google profile picture)

**First-time users:** Account is automatically created with Google profile information.
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'Google OAuth successful',
        type: AuthSuccessResponse,
    })
    @ApiResponse({ status: 400, description: 'Missing authorization code or state' })
    @ApiResponse({ status: 401, description: 'Google OAuth failed' })
    @Public()
    @Get('google/callback')
    googleCallback() {
        // Proxied to auth-svc
    }

    @ApiOperation({
        summary: 'Refresh access token',
        description: `
Uses a valid refresh token to obtain a new access token and refresh token pair.

**Token Rotation:** Old refresh token is invalidated after use.

**Use Case:** Call this endpoint before the access token expires to maintain session.
    `,
    })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: 200,
        description: 'Tokens refreshed successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Tokens refreshed successfully' },
                        tokens: {
                            type: 'object',
                            properties: {
                                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiI...' },
                                refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiI...' },
                                expiresIn: { type: 'number', example: 900 },
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    @Public()
    @Post('tokens/refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Body() _dto: RefreshTokenDto) {
        // Proxied to auth-svc
    }

    @ApiOperation({
        summary: 'Logout (revoke refresh token)',
        description: `
Revokes the specified refresh token, effectively logging out the user session.

**Note:** The access token will remain valid until it expires. For immediate invalidation, clients should discard the access token locally.
    `,
    })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: 200,
        description: 'Logged out successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Logged out successfully' },
                    },
                },
            },
        },
    })
    @Public()
    @Post('tokens/logout')
    @HttpCode(HttpStatus.OK)
    logout(@Body() _dto: RefreshTokenDto) {
        // Proxied to auth-svc
    }

    @ApiOperation({
        summary: 'Get current user profile',
        description: `
Returns the profile of the currently authenticated user.

**Requires:** Valid JWT access token in Authorization header.
    `,
    })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully',
        type: UserResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - invalid or expired token' })
    @Get('me')
    getProfile() {
        // Proxied to auth-svc
    }
}
