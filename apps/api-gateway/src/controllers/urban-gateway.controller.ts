import {
    Controller,
    Get,
    Post,
    Put,
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
    CreateGrievanceDto,
    QueryGrievanceDto,
    EscalateGrievanceDto,
    GrievanceResponse,
} from '../../dto/urban/grievances.dto';
import {
    CategoryResponse,
    QueryCategoryDto,
} from '../../dto/urban/categories.dto';

/**
 * Urban Gateway Controller
 * Documents urban service endpoints for Swagger UI.
 * NOTE: These endpoints are proxied to urban-svc - no implementation here.
 */
@ApiTags('Urban Services')
@Controller('services/urban')
export class UrbanGatewayController {
    // ==================== CATEGORIES ====================

    @ApiOperation({
        summary: 'Get all grievance categories',
        description: `
Retrieve all available grievance categories.

**Categories include:**
- Street Lighting
- Water Supply
- Sewage/Drainage
- Roads and Footpaths
- Garbage Collection
- Public Parks
- Building Permits
- And more...
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'Categories retrieved successfully',
        type: [CategoryResponse],
    })
    @Public()
    @Get('categories')
    getCategories(@Query() _query: QueryCategoryDto) {
        // Proxied to urban-svc
    }

    @ApiOperation({
        summary: 'Get category by ID',
        description: 'Retrieve detailed information about a specific grievance category.',
    })
    @ApiParam({ name: 'id', description: 'Category UUID' })
    @ApiResponse({
        status: 200,
        description: 'Category details retrieved successfully',
        type: CategoryResponse,
    })
    @ApiResponse({ status: 404, description: 'Category not found' })
    @Public()
    @Get('categories/:id')
    getCategory(@Param('id') _id: string) {
        // Proxied to urban-svc
    }

    // ==================== GRIEVANCES ====================

    @ApiOperation({
        summary: 'Get all grievances',
        description: `
Retrieve a paginated list of grievances with optional filtering.

**Filters available:**
- Category
- Status (submitted, under review, in progress, resolved, closed, escalated)
- Priority (low, medium, high, urgent)
- City and pincode
- Date range
- Search by title/description

**Note:** Results may be filtered based on user role.
    `,
    })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({
        status: 200,
        description: 'Grievances retrieved successfully',
        type: [GrievanceResponse],
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get('grievances')
    getGrievances(@Query() _query: QueryGrievanceDto) {
        // Proxied to urban-svc
    }

    @ApiOperation({
        summary: 'Get my grievances',
        description: 'Retrieve all grievances submitted by the currently authenticated user.',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({
        status: 200,
        description: 'User grievances retrieved successfully',
        type: [GrievanceResponse],
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get('grievances/me')
    getMyGrievances(@Query() _query: QueryGrievanceDto) {
        // Proxied to urban-svc
    }

    @ApiOperation({
        summary: 'Get grievance by ID',
        description: 'Retrieve detailed information about a specific grievance.',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Grievance UUID' })
    @ApiResponse({
        status: 200,
        description: 'Grievance details retrieved successfully',
        type: GrievanceResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Grievance not found' })
    @Get('grievances/:id')
    getGrievance(@Param('id') _id: string) {
        // Proxied to urban-svc
    }

    @ApiOperation({
        summary: 'Get grievance status',
        description: 'Get the current status and update history of a grievance.',
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Grievance UUID' })
    @ApiResponse({
        status: 200,
        description: 'Grievance status retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                currentStatus: { type: 'string', example: 'in_progress' },
                ticketNumber: { type: 'string', example: 'GRV-2026-00001' },
                history: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            status: { type: 'string' },
                            remarks: { type: 'string' },
                            timestamp: { type: 'string' },
                            updatedBy: { type: 'string' },
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Cannot access grievance owned by another user' })
    @ApiResponse({ status: 404, description: 'Grievance not found' })
    @Get('grievances/:id/status')
    getGrievanceStatus(@Param('id') _id: string) {
        // Proxied to urban-svc
    }

    @ApiOperation({
        summary: 'Submit a new grievance',
        description: `
Submit a new civic grievance for resolution.

**Required fields:**
- Category ID
- Title (10-200 characters)
- Description (20-2000 characters)

**Optional fields:**
- Location/address
- GPS coordinates
- Priority level
- Attachments (image URLs)

**Note:** This endpoint is for citizen users only. Admin users cannot submit grievances.
    `,
    })
    @ApiBearerAuth('JWT-auth')
    @ApiBody({ type: CreateGrievanceDto })
    @ApiResponse({
        status: 201,
        description: 'Grievance submitted successfully',
        type: GrievanceResponse,
    })
    @ApiResponse({ status: 400, description: 'Invalid grievance data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin users cannot submit grievances' })
    @Post('grievances')
    createGrievance(@Body() _dto: CreateGrievanceDto) {
        // Proxied to urban-svc
    }

    @ApiOperation({
        summary: 'Escalate a grievance',
        description: `
Escalate a grievance if it hasn't been addressed in a timely manner.

**Escalation criteria:**
- Grievance must be older than SLA period
- Can only escalate own grievances
- Reason is mandatory

**After escalation:**
- Grievance is flagged for priority attention
- Supervisor is notified
- Status changes to 'escalated'
    `,
    })
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'Grievance UUID' })
    @ApiBody({ type: EscalateGrievanceDto })
    @ApiResponse({
        status: 200,
        description: 'Grievance escalated successfully',
        type: GrievanceResponse,
    })
    @ApiResponse({ status: 400, description: 'Grievance cannot be escalated yet' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Cannot escalate grievance owned by another user' })
    @ApiResponse({ status: 404, description: 'Grievance not found' })
    @Put('grievances/:id/escalate')
    escalateGrievance(@Param('id') _id: string, @Body() _dto: EscalateGrievanceDto) {
        // Proxied to urban-svc
    }
}
