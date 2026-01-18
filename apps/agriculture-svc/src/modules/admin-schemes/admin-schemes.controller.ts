import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AdminSchemesService } from './admin-schemes.service';
import { CreateSchemeDto } from './dto/create-scheme.dto';
import { UpdateSchemeDto } from './dto/update-scheme.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { AdminOnly, GetCurrentUser, CurrentUser } from '@dpi/common';
import { ApplicationStatus } from '../schemes/entities/application.entity';

@Controller('admin/schemes')
export class AdminSchemesController {
    constructor(private readonly adminSchemesService: AdminSchemesService) { }

    @Post()
    @AdminOnly()
    createScheme(@Body() dto: CreateSchemeDto) {
        return this.adminSchemesService.createScheme(dto);
    }

    @Put(':id')
    @AdminOnly()
    updateScheme(@Param('id') id: string, @Body() dto: UpdateSchemeDto) {
        return this.adminSchemesService.updateScheme(id, dto);
    }

    @Delete(':id')
    @AdminOnly()
    deleteScheme(@Param('id') id: string) {
        return this.adminSchemesService.deleteScheme(id);
    }

    @Get('applications')
    @AdminOnly()
    findAllApplications(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('status') status?: ApplicationStatus,
    ) {
        return this.adminSchemesService.findAllApplications(page, limit, status);
    }

    @Put('applications/:id/status')
    @AdminOnly()
    updateApplicationStatus(
        @Param('id') id: string,
        @Body() dto: UpdateApplicationStatusDto,
        @GetCurrentUser() user: CurrentUser,
    ) {
        return this.adminSchemesService.updateApplicationStatus(id, dto, user.sub);
    }

    @Get('stats')
    @AdminOnly()
    getStats() {
        return this.adminSchemesService.getStats();
    }
}
