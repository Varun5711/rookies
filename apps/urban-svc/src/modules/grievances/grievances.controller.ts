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
import { CurrentUser, ICurrentUser } from '@dpi/common';

@Controller('grievances')
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  @Post()
  create(
    @CurrentUser() user: ICurrentUser,
    @Body() createDto: CreateGrievanceDto,
  ) {
    return this.grievancesService.create(user.id, createDto);
  }

  @Get()
  findAll(@Query() query: QueryGrievanceDto) {
    return this.grievancesService.findAll(query);
  }

  @Get('me')
  findMyGrievances(
    @CurrentUser() user: ICurrentUser,
    @Query() query: QueryGrievanceDto,
  ) {
    return this.grievancesService.findByUser(user.id, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.grievancesService.findOne(id);
  }

  @Get(':id/status')
  getStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.grievancesService.getStatus(id, user.id);
  }

  @Put(':id/escalate')
  escalate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: ICurrentUser,
    @Body() escalateDto: EscalateGrievanceDto,
  ) {
    return this.grievancesService.escalate(id, user.id, escalateDto);
  }
}
