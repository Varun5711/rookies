import { IsOptional, IsString, IsEnum, IsNumber, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { CommodityCategory } from '../entities/commodity-price.entity';

export class QueryPriceDto {
  @IsString()
  @IsOptional()
  commodity?: string;

  @IsEnum(CommodityCategory)
  @IsOptional()
  category?: CommodityCategory;

  @IsString()
  @IsOptional()
  mandi?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @IsDateString()
  @IsOptional()
  toDate?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
