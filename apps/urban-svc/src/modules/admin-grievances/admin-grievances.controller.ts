import { Controller, Get, Put, Body, Param, Query } from '@nestjs/common';
import { AdminGrievancesService } from './admin-grievances.service';
import { UpdateGrievanceStatusDto } from './dto/update-grievance-status.dto';
import { AssignGrievanceDto } from './dto/assign-grievance.dto';
import { AdminOnly, CurrentUser, GetCurrentUser } from '@dpi/common';
import { GrievanceStatus } from '../grievances/entities/grievance.entity';

@Controller('admin/grievances')
export class AdminGrievancesController {
    constructor(private readonly adminGrievancesService: AdminGrievancesService) { }

    @Get()
    @AdminOnly()
    findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('status') status?: GrievanceStatus,
        @Query('ward') ward?: string,
    ) {
        return this.adminGrievancesService.findAll(page, limit, status, ward);
    }

    @Get('stats')
    @AdminOnly()
    getStats() {
        return this.adminGrievancesService.getStats();
    }

    @Get(':id')
    @AdminOnly()
    findOne(@Param('id') id: string) {
        return this.adminGrievancesService.findOne(id);
    }

    @Put(':id/status')
    @AdminOnly()
    updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateGrievanceStatusDto,
        @GetCurrentUser() user: CurrentUser,
    ) {
        return this.adminGrievancesService.updateStatus(id, dto, user?.sub);
    }

    @Put(':id/assign')
    @AdminOnly()
    assign(
        @Param('id') id: string,
        @Body() dto: AssignGrievanceDto,
    ) {
        return this.adminGrievancesService.assign(id, dto);
    }

    @Put(':id/priority')
    @AdminOnly()
    updatePriority(
        @Param('id') id: string,
        @Body() dto: AssignGrievanceDto, // Using AssignGrievanceDto as it has priority
    ) {
        return this.adminGrievancesService.assign(id, dto);
    }
}
