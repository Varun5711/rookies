import { Controller, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AdminAppointmentsService } from './admin-appointments.service';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { QueryAppointmentDto } from '../appointments/dto/query-appointment.dto';
import { AdminOnly } from '@dpi/common';

@Controller('admin/appointments')
export class AdminAppointmentsController {
    constructor(private readonly adminAppointmentsService: AdminAppointmentsService) { }

    @Get()
    @AdminOnly()
    findAll(@Query() query: QueryAppointmentDto) {
        return this.adminAppointmentsService.findAll(query);
    }

    @Get('stats')
    @AdminOnly()
    getStats() {
        return this.adminAppointmentsService.getStats();
    }

    @Get(':id')
    @AdminOnly()
    findOne(@Param('id') id: string) {
        return this.adminAppointmentsService.findOne(id);
    }

    @Put(':id/status')
    @AdminOnly()
    updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateAppointmentStatusDto,
    ) {
        return this.adminAppointmentsService.updateStatus(id, dto);
    }

    @Delete(':id')
    @AdminOnly()
    cancel(@Param('id') id: string) {
        const dto: UpdateAppointmentStatusDto = {
            status: 'CANCELLED' as any,
            cancellationReason: 'Cancelled by admin',
        };
        return this.adminAppointmentsService.updateStatus(id, dto);
    }
}
