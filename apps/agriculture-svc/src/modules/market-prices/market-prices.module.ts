import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommodityPrice } from './entities/commodity-price.entity';
import { MarketPricesService } from './market-prices.service';
import { MarketPricesController } from './market-prices.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommodityPrice])],
  controllers: [MarketPricesController],
  providers: [MarketPricesService],
  exports: [MarketPricesService],
})
export class MarketPricesModule {}
