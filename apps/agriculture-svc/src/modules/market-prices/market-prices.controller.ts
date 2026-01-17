import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { MarketPricesService } from './market-prices.service';
import { QueryPriceDto } from './dto/query-price.dto';
import { Public } from '@dpi/common';

@Controller('market-prices')
export class MarketPricesController {
  constructor(private readonly marketPricesService: MarketPricesService) {}

  @Get()
  @Public()
  findAll(@Query() query: QueryPriceDto) {
    return this.marketPricesService.findAll(query);
  }

  @Get('commodities')
  @Public()
  getCommodities() {
    return this.marketPricesService.getDistinctCommodities();
  }

  @Get('mandis')
  @Public()
  getMandis(@Query('state') state?: string) {
    return this.marketPricesService.getDistinctMandis(state);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.marketPricesService.findOne(id);
  }
}
