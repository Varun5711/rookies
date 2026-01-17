import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Advisory } from './entities/advisory.entity';
import { QueryAdvisoryDto } from './dto/query-advisory.dto';

@Injectable()
export class AdvisoriesService {
  constructor(
    @InjectRepository(Advisory)
    private readonly advisoryRepository: Repository<Advisory>,
  ) {}

  async findAll(query: QueryAdvisoryDto) {
    const { cropName, season, category, state, district, search, page = 1, limit = 10 } = query;

    const where: FindOptionsWhere<Advisory> = { isActive: true };

    if (cropName) where.cropName = cropName;
    if (season) where.season = season;
    if (category) where.category = category;
    if (state) where.state = state;
    if (district) where.district = district;
    if (search) where.title = Like(`%${search}%`);

    const [advisories, total] = await this.advisoryRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: advisories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Advisory> {
    const advisory = await this.advisoryRepository.findOne({ where: { id } });

    if (!advisory) {
      throw new NotFoundException(`Advisory with ID ${id} not found`);
    }

    return advisory;
  }

  async findByCrop(cropName: string): Promise<Advisory[]> {
    return this.advisoryRepository.find({
      where: { cropName, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByState(state: string): Promise<Advisory[]> {
    return this.advisoryRepository.find({
      where: { state, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
}
