import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { Public } from '@dpi/common';
import {
    QuerySchemeDto,
    ApplySchemeDto,
    QueryApplicationDto,
    SchemeResponse,
    ApplicationResponse,
} from '../../dto/agriculture/schemes.dto';
import {
    QueryMarketPriceDto,
    MarketPriceResponse,
} from '../../dto/agriculture/market-prices.dto';
import {
    QueryAdvisoryDto,
    AdvisoryResponse,
} from '../../dto/agriculture/advisories.dto';

/**
 * Agriculture Gateway Controller
 * Documents agriculture service endpoints for Swagger UI.
 * NOTE: These endpoints are proxied to agriculture-svc - no implementation here.
 */
@ApiTags('Agriculture Services')
@Controller('services/agriculture')
export class AgricultureGatewayController {
    // ==================== SCHEMES ====================

    @ApiOperation({
        summary: 'Get all agricultural schemes',
        description: `
Retrieve a paginated list of government agricultural schemes.

**Filters available:**
- Category (crop insurance, subsidy, loan, etc.)
- State
- Active status
- Search by name/description
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'List of schemes retrieved successfully',
        type: [SchemeResponse],
    })
    @Public()
    @Get('schemes')
    getSchemes(@Query() _query: QuerySchemeDto) {
        // Proxied to agriculture-svc
    }

    @ApiOperation({
        summary: 'Get scheme by ID',
        description: 'Retrieve detailed information about a specific agricultural scheme including eligibility criteria and required documents.',
    })
    @ApiParam({ name: 'id', description: 'Scheme UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
    @ApiResponse({
        status: 200,
        description: 'Scheme details retrieved successfully',
        type: SchemeResponse,
    })
    @ApiResponse({ status: 404, description: 'Scheme not found' })
    @Public()
    @Get('schemes/:id')
    getScheme(@Param('id') _id: string) {
        // Proxied to agriculture-svc
    }

    @ApiOperation({
        summary: 'Apply for a scheme',
        description: `
Submit an application for a specific agricultural scheme.

**Requirements:**
- User must be authenticated
- Land area and crop type are mandatory
- Bank account details required for schemes with monetary benefits

**Note:** This endpoint is for citizen users only. Admin users cannot apply on behalf of users.
    `,
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Scheme UUID to apply for' })
    @ApiBody({ type: ApplySchemeDto })
    @ApiResponse({
        status: 201,
        description: 'Application submitted successfully',
        type: ApplicationResponse,
    })
    @ApiResponse({ status: 400, description: 'Invalid application data or scheme not active' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin users cannot apply for schemes' })
    @ApiResponse({ status: 404, description: 'Scheme not found' })
    @Post('schemes/:id/apply')
    applyForScheme(@Param('id') _id: string, @Body() _dto: ApplySchemeDto) {
        // Proxied to agriculture-svc
    }

    // ==================== MY APPLICATIONS ====================

    @ApiOperation({
        summary: 'Get my scheme applications',
        description: 'Retrieve all scheme applications submitted by the currently authenticated user.',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({
        status: 200,
        description: 'Applications retrieved successfully',
        type: [ApplicationResponse],
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get('schemes/me/applications')
    getMyApplications(@Query() _query: QueryApplicationDto) {
        // Proxied to agriculture-svc
    }

    @ApiOperation({
        summary: 'Get application status',
        description: 'Get the current status and details of a specific application.',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Application UUID' })
    @ApiResponse({
        status: 200,
        description: 'Application status retrieved successfully',
        type: ApplicationResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Cannot access application owned by another user' })
    @ApiResponse({ status: 404, description: 'Application not found' })
    @Get('schemes/applications/:id')
    getApplicationStatus(@Param('id') _id: string) {
        // Proxied to agriculture-svc
    }

    // ==================== MARKET PRICES ====================

    @ApiOperation({
        summary: 'Get market prices',
        description: `
Retrieve current agricultural commodity prices from various mandis (markets).

**Data includes:**
- Minimum, maximum, and modal prices per quintal
- Market/mandi name and location
- Price date

**Filters available:**
- Crop name
- Category (vegetables, fruits, grains, etc.)
- Market name
- State and district
- Date range
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'Market prices retrieved successfully',
        type: [MarketPriceResponse],
    })
    @Public()
    @Get('market-prices')
    getMarketPrices(@Query() _query: QueryMarketPriceDto) {
        // Proxied to agriculture-svc
    }

    @ApiOperation({
        summary: 'Get market price by ID',
        description: 'Retrieve specific market price record.',
    })
    @ApiParam({ name: 'id', description: 'Price record UUID' })
    @ApiResponse({
        status: 200,
        description: 'Market price retrieved successfully',
        type: MarketPriceResponse,
    })
    @ApiResponse({ status: 404, description: 'Price record not found' })
    @Public()
    @Get('market-prices/:id')
    getMarketPrice(@Param('id') _id: string) {
        // Proxied to agriculture-svc
    }

    // ==================== ADVISORIES ====================

    @ApiOperation({
        summary: 'Get agricultural advisories',
        description: `
Retrieve agricultural advisories and alerts for farmers.

**Types of advisories:**
- Weather alerts
- Pest and disease control
- Crop management tips
- Irrigation guidance
- Harvest recommendations
- Market insights

**Filters available:**
- Advisory type
- Crop
- Location (state, district)
- Severity level
- Active status
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'Advisories retrieved successfully',
        type: [AdvisoryResponse],
    })
    @Public()
    @Get('advisories')
    getAdvisories(@Query() _query: QueryAdvisoryDto) {
        // Proxied to agriculture-svc
    }

    @ApiOperation({
        summary: 'Get advisory by ID',
        description: 'Retrieve detailed information about a specific advisory.',
    })
    @ApiParam({ name: 'id', description: 'Advisory UUID' })
    @ApiResponse({
        status: 200,
        description: 'Advisory retrieved successfully',
        type: AdvisoryResponse,
    })
    @ApiResponse({ status: 404, description: 'Advisory not found' })
    @Public()
    @Get('advisories/:id')
    getAdvisory(@Param('id') _id: string) {
        // Proxied to agriculture-svc
    }
}
