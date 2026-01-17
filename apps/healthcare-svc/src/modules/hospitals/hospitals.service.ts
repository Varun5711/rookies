import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Hospital } from './entities/hospital.entity';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { QueryHospitalDto } from './dto/query-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
  ) {}

  async create(createHospitalDto: CreateHospitalDto): Promise<Hospital> {
    const hospital = this.hospitalRepository.create(createHospitalDto);
    return this.hospitalRepository.save(hospital);
  }

  async findAll(query: QueryHospitalDto) {
    const { city, state, pincode, type, search, page = 1, limit = 10 } = query;

    const where: FindOptionsWhere<Hospital> = { isActive: true };

    if (city) where.city = city;
    if (state) where.state = state;
    if (pincode) where.pincode = pincode;
    if (type) where.type = type;
    if (search) where.name = Like(`%${search}%`);

    const [hospitals, total] = await this.hospitalRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data: hospitals,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Hospital> {
    const hospital = await this.hospitalRepository.findOne({
      where: { id },
      relations: ['doctors'],
    });

    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    return hospital;
  }

  async update(id: string, updateDto: Partial<CreateHospitalDto>): Promise<Hospital> {
    const hospital = await this.findOne(id);
    Object.assign(hospital, updateDto);
    return this.hospitalRepository.save(hospital);
  }

  async remove(id: string): Promise<void> {
    const hospital = await this.findOne(id);
    await this.hospitalRepository.remove(hospital);
  }

  async findByCity(city: string): Promise<Hospital[]> {
    return this.hospitalRepository.find({
      where: { city, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByState(state: string): Promise<Hospital[]> {
    return this.hospitalRepository.find({
      where: { state, isActive: true },
      order: { name: 'ASC' },
    });
  }
}
