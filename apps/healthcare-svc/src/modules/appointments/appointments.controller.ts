import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { QueryAppointmentDto } from './dto/query-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { GetCurrentUser, CurrentUser } from '@dpi/common';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(
    @GetCurrentUser() user: CurrentUser,
    @Body() createDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(user.sub, createDto);
  }

  @Get()
  findAll(@Query() query: QueryAppointmentDto) {
    return this.appointmentsService.findAll(query);
  }

  @Get('me')
  findMyAppointments(
    @GetCurrentUser() user: CurrentUser,
    @Query() query: QueryAppointmentDto,
  ) {
    return this.appointmentsService.findByUser(user.sub, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Put(':id/cancel')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @GetCurrentUser() user: CurrentUser,
    @Body() cancelDto: CancelAppointmentDto,
  ) {
    return this.appointmentsService.cancel(id, user.sub, cancelDto);
  }
}
