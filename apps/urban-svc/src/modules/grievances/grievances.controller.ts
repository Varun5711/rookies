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
import { GrievancesService } from './grievances.service';
import { CreateGrievanceDto } from './dto/create-grievance.dto';
import { QueryGrievanceDto } from './dto/query-grievance.dto';
import { EscalateGrievanceDto } from './dto/escalate-grievance.dto';
import { GetCurrentUser, CurrentUser } from '@dpi/common';

@Controller('grievances')
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  @Post()
  create(
    @GetCurrentUser() user: CurrentUser,
    @Body() createDto: CreateGrievanceDto,
  ) {
    return this.grievancesService.create(user.sub, createDto);
  }

  @Get()
  findAll(@Query() query: QueryGrievanceDto) {
    return this.grievancesService.findAll(query);
  }

  @Get('me')
  findMyGrievances(
    @GetCurrentUser() user: CurrentUser,
    @Query() query: QueryGrievanceDto,
  ) {
    return this.grievancesService.findByUser(user.sub, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.grievancesService.findOne(id);
  }

  @Get(':id/status')
  getStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.grievancesService.getStatus(id, user.sub);
  }

  @Put(':id/escalate')
  escalate(
    @Param('id', ParseUUIDPipe) id: string,
    @GetCurrentUser() user: CurrentUser,
    @Body() escalateDto: EscalateGrievanceDto,
  ) {
    return this.grievancesService.escalate(id, user.sub, escalateDto);
  }
}
