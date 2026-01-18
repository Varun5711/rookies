import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grievance, GrievanceStatus } from '../grievances/entities/grievance.entity';
import { UpdateGrievanceStatusDto } from './dto/update-grievance-status.dto';
import { AssignGrievanceDto } from './dto/assign-grievance.dto';

@Injectable()
export class AdminGrievancesService {
    constructor(
        @InjectRepository(Grievance)
        private readonly grievanceRepository: Repository<Grievance>,
    ) { }

    async findAll(page = 1, limit = 10, status?: GrievanceStatus, ward?: string) {
        const query = this.grievanceRepository.createQueryBuilder('grievance')
            .leftJoinAndSelect('grievance.category', 'category')
            .orderBy('grievance.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        if (status) {
            query.andWhere('grievance.status = :status', { status });
        }
        if (ward) {
            query.andWhere('grievance.ward = :ward', { ward });
        }

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<Grievance> {
        const grievance = await this.grievanceRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!grievance) {
            throw new NotFoundException(`Grievance with ID ${id} not found`);
        }

        return grievance;
    }

    async updateStatus(id: string, dto: UpdateGrievanceStatusDto, adminId?: string): Promise<Grievance> {
        const grievance = await this.findOne(id);
        grievance.status = dto.status;

        if (dto.resolution) grievance.resolution = dto.resolution;

        if (dto.status === GrievanceStatus.RESOLVED || dto.status === GrievanceStatus.CLOSED) {
            grievance.resolvedAt = new Date();
            grievance.resolvedBy = adminId;
        }

        return this.grievanceRepository.save(grievance);
    }

    async assign(id: string, dto: AssignGrievanceDto): Promise<Grievance> {
        const grievance = await this.findOne(id);

        if (dto.assignedTo) grievance.assignedTo = dto.assignedTo;
        if (dto.assignedDepartment) grievance.assignedDepartment = dto.assignedDepartment;
        if (dto.priority) grievance.priority = dto.priority;
        if (dto.escalationReason) {
            grievance.escalationReason = dto.escalationReason;
            grievance.escalatedAt = new Date();
            grievance.status = GrievanceStatus.ESCALATED;
        }

        return this.grievanceRepository.save(grievance);
    }

    async getStats() {
        const stats = await this.grievanceRepository.createQueryBuilder('grievance')
            .select('grievance.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('grievance.status')
            .getRawMany();

        return stats;
    }
}
