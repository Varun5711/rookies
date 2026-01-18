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
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { QueryHospitalDto } from './dto/query-hospital.dto';
import { Public, Roles, UserRole } from '@dpi/common';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) { }

  @Post()
  @Roles(UserRole.PLATFORM_ADMIN)
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalsService.create(createHospitalDto);
  }

  @Get()
  @Public()
  findAll(@Query() query: QueryHospitalDto) {
    return this.hospitalsService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.hospitalsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.PLATFORM_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<CreateHospitalDto>,
  ) {
    return this.hospitalsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.PLATFORM_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.hospitalsService.remove(id);
  }
}
