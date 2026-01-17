import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { AdvisoriesService } from './advisories.service';
import { QueryAdvisoryDto } from './dto/query-advisory.dto';
import { Public } from '@dpi/common';

@Controller('advisories')
export class AdvisoriesController {
  constructor(private readonly advisoriesService: AdvisoriesService) {}

  @Get()
  @Public()
  findAll(@Query() query: QueryAdvisoryDto) {
    return this.advisoriesService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.advisoriesService.findOne(id);
  }
}
