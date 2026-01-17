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
import { Public } from '@dpi/common';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<CreateDoctorDto>,
  ) {
    return this.doctorsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.doctorsService.remove(id);
  }

  @Get(':id/slots')
  @Public()
  getSlots(@Param('id', ParseUUIDPipe) id: string) {
    return this.doctorsService.getSlots(id);
  }

  @Post(':id/slots')
  createSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createSlotDto: Omit<CreateTimeSlotDto, 'doctorId'>,
  ) {
    return this.doctorsService.createSlot({ ...createSlotDto, doctorId: id });
  }

  @Put('slots/:slotId')
  updateSlot(
    @Param('slotId', ParseUUIDPipe) slotId: string,
    @Body() updateDto: Partial<CreateTimeSlotDto>,
  ) {
    return this.doctorsService.updateSlot(slotId, updateDto);
  }

  @Delete('slots/:slotId')
  removeSlot(@Param('slotId', ParseUUIDPipe) slotId: string) {
    return this.doctorsService.removeSlot(slotId);
  }
}
