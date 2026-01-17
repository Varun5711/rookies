import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CommodityPrice } from './entities/commodity-price.entity';
import { QueryPriceDto } from './dto/query-price.dto';

@Injectable()
export class MarketPricesService {
  constructor(
    @InjectRepository(CommodityPrice)
    private readonly priceRepository: Repository<CommodityPrice>,
  ) {}

  async findAll(query: QueryPriceDto) {
    const {
      commodity,
      category,
      mandi,
      state,
      district,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = query;

    const where: FindOptionsWhere<CommodityPrice> = {};

    if (commodity) where.commodity = Like(`%${commodity}%`);
    if (category) where.category = category;
    if (mandi) where.mandi = mandi;
    if (state) where.state = state;
    if (district) where.district = district;

    if (fromDate && toDate) {
      where.priceDate = Between(new Date(fromDate), new Date(toDate));
    } else if (fromDate) {
      where.priceDate = MoreThanOrEqual(new Date(fromDate));
    } else if (toDate) {
      where.priceDate = LessThanOrEqual(new Date(toDate));
    }

    const [prices, total] = await this.priceRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { priceDate: 'DESC', commodity: 'ASC' },
    });

    return {
      data: prices,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<CommodityPrice> {
    const price = await this.priceRepository.findOne({ where: { id } });

    if (!price) {
      throw new NotFoundException(`Price record with ID ${id} not found`);
    }

    return price;
  }

  async findLatestByCommodity(commodity: string): Promise<CommodityPrice[]> {
    return this.priceRepository.find({
      where: { commodity: Like(`%${commodity}%`) },
      order: { priceDate: 'DESC' },
      take: 10,
    });
  }

  async findByMandi(mandi: string): Promise<CommodityPrice[]> {
    return this.priceRepository.find({
      where: { mandi },
      order: { priceDate: 'DESC', commodity: 'ASC' },
      take: 50,
    });
  }

  async getDistinctCommodities(): Promise<string[]> {
    const result = await this.priceRepository
      .createQueryBuilder('price')
      .select('DISTINCT price.commodity', 'commodity')
      .orderBy('commodity', 'ASC')
      .getRawMany();

    return result.map((r) => r.commodity);
  }

  async getDistinctMandis(state?: string): Promise<string[]> {
    const query = this.priceRepository
      .createQueryBuilder('price')
      .select('DISTINCT price.mandi', 'mandi');

    if (state) {
      query.where('price.state = :state', { state });
    }

    const result = await query.orderBy('mandi', 'ASC').getRawMany();

    return result.map((r) => r.mandi);
  }
}
