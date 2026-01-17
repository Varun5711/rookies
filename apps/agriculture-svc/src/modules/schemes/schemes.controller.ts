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
import { CurrentUser, ICurrentUser, Public } from '@dpi/common';

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
    @CurrentUser() user: ICurrentUser,
    @Body() applyDto: ApplySchemeDto,
  ) {
    return this.schemesService.apply(id, user.id, applyDto);
  }

  @Get('me/applications')
  findMyApplications(
    @CurrentUser() user: ICurrentUser,
    @Query() query: QueryApplicationDto,
  ) {
    return this.schemesService.findUserApplications(user.id, query);
  }

  @Get('applications/:id')
  getApplicationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.schemesService.getApplicationStatus(id, user.id);
  }
}
