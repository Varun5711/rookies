import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SchemesService } from './schemes.service';
import { QuerySchemeDto } from './dto/query-scheme.dto';
import { ApplySchemeDto } from './dto/apply-scheme.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { GetCurrentUser, CurrentUser, Public } from '@dpi/common';

@Controller('schemes')
export class SchemesController {
  constructor(private readonly schemesService: SchemesService) {}

  @Get()
  @Public()
  findAll(@Query() query: QuerySchemeDto) {
    return this.schemesService.findAllSchemes(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.schemesService.findOneScheme(id);
  }

  @Post(':id/apply')
  apply(
    @Param('id', ParseUUIDPipe) id: string,
    @GetCurrentUser() user: CurrentUser,
    @Body() applyDto: ApplySchemeDto,
  ) {
    return this.schemesService.apply(id, user.sub, applyDto);
  }

  @Get('me/applications')
  findMyApplications(
    @GetCurrentUser() user: CurrentUser,
    @Query() query: QueryApplicationDto,
  ) {
    return this.schemesService.findUserApplications(user.sub, query);
  }

  @Get('applications/:id')
  getApplicationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.schemesService.getApplicationStatus(id, user.sub);
  }
}
