import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminSchemesService } from './admin-schemes.service';
import { CreateSchemeDto } from './dto/create-scheme.dto';
import { UpdateSchemeDto } from './dto/update-scheme.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { AdminOnly, CurrentUser, GetCurrentUser } from '@dpi/common';

@Controller('admin')
export class AdminSchemesController {
    constructor(private readonly adminSchemesService: AdminSchemesService) { }

    @Post('schemes')
    @AdminOnly()
    createScheme(@Body() dto: CreateSchemeDto) {
        return this.adminSchemesService.createScheme(dto);
    }

    @Put('schemes/:id')
    @AdminOnly()
    updateScheme(@Param('id') id: string, @Body() dto: UpdateSchemeDto) {
        return this.adminSchemesService.updateScheme(id, dto);
    }

    @Delete('schemes/:id')
    @AdminOnly()
    deleteScheme(@Param('id') id: string) {
        return this.adminSchemesService.deleteScheme(id);
    }

    @Get('schemes/stats')
    @AdminOnly()
    getStats() {
        return this.adminSchemesService.getStats();
    }

    @Get('applications')
    @AdminOnly()
    findAllApplications(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('status') status?: string,
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
        return this.adminSchemesService.updateApplicationStatus(id, dto, user?.sub);
    }
}
