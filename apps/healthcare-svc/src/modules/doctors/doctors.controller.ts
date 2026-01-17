import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';
import { Public, Roles, UserRole } from '@dpi/common';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @Roles(UserRole.DEPARTMENT_ADMIN, UserRole.SERVICE_PROVIDER, UserRole.PLATFORM_ADMIN)
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @Public()
  findAll(@Query() query: QueryDoctorDto) {
    return this.doctorsService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.doctorsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.DEPARTMENT_ADMIN, UserRole.SERVICE_PROVIDER, UserRole.PLATFORM_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<CreateDoctorDto>,
  ) {
    return this.doctorsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.PLATFORM_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.doctorsService.remove(id);
  }

  @Get(':id/slots')
  @Public()
  getSlots(@Param('id', ParseUUIDPipe) id: string) {
    return this.doctorsService.getSlots(id);
  }

  @Post(':id/slots')
  @Roles(UserRole.DEPARTMENT_ADMIN, UserRole.SERVICE_PROVIDER, UserRole.PLATFORM_ADMIN)
  createSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createSlotDto: Omit<CreateTimeSlotDto, 'doctorId'>,
  ) {
    return this.doctorsService.createSlot({ ...createSlotDto, doctorId: id });
  }

  @Put('slots/:slotId')
  @Roles(UserRole.DEPARTMENT_ADMIN, UserRole.SERVICE_PROVIDER, UserRole.PLATFORM_ADMIN)
  updateSlot(
    @Param('slotId', ParseUUIDPipe) slotId: string,
    @Body() updateDto: Partial<CreateTimeSlotDto>,
  ) {
    return this.doctorsService.updateSlot(slotId, updateDto);
  }

  @Delete('slots/:slotId')
  @Roles(UserRole.DEPARTMENT_ADMIN, UserRole.PLATFORM_ADMIN)
  removeSlot(@Param('slotId', ParseUUIDPipe) slotId: string) {
    return this.doctorsService.removeSlot(slotId);
  }
}
