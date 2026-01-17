import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepository: Repository<TimeSlot>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorRepository.create(createDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async findAll(query: QueryDoctorDto) {
    const { hospitalId, specialization, search, page = 1, limit = 10 } = query;

    const where: FindOptionsWhere<Doctor> = { isAvailable: true };

    if (hospitalId) where.hospitalId = hospitalId;
    if (specialization) where.specialization = specialization;
    if (search) where.name = Like(`%${search}%`);

    const [doctors, total] = await this.doctorRepository.findAndCount({
      where,
      relations: ['hospital'],
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data: doctors,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['hospital', 'timeSlots'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return doctor;
  }

  async update(id: string, updateDto: Partial<CreateDoctorDto>): Promise<Doctor> {
    const doctor = await this.findOne(id);
    Object.assign(doctor, updateDto);
    return this.doctorRepository.save(doctor);
  }

  async remove(id: string): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.remove(doctor);
  }

  async getSlots(doctorId: string): Promise<TimeSlot[]> {
    await this.findOne(doctorId);
    return this.timeSlotRepository.find({
      where: { doctorId, isAvailable: true },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async createSlot(createSlotDto: CreateTimeSlotDto): Promise<TimeSlot> {
    await this.findOne(createSlotDto.doctorId);
    const slot = this.timeSlotRepository.create(createSlotDto);
    return this.timeSlotRepository.save(slot);
  }

  async updateSlot(slotId: string, updateDto: Partial<CreateTimeSlotDto>): Promise<TimeSlot> {
    const slot = await this.timeSlotRepository.findOne({ where: { id: slotId } });
    if (!slot) {
      throw new NotFoundException(`Time slot with ID ${slotId} not found`);
    }
    Object.assign(slot, updateDto);
    return this.timeSlotRepository.save(slot);
  }

  async removeSlot(slotId: string): Promise<void> {
    const slot = await this.timeSlotRepository.findOne({ where: { id: slotId } });
    if (!slot) {
      throw new NotFoundException(`Time slot with ID ${slotId} not found`);
    }
    await this.timeSlotRepository.remove(slot);
  }

  async findByHospital(hospitalId: string): Promise<Doctor[]> {
    return this.doctorRepository.find({
      where: { hospitalId, isAvailable: true },
      order: { name: 'ASC' },
    });
  }
}
