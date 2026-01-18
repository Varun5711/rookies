import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scheme } from '../schemes/entities/scheme.entity';
import { Application, ApplicationStatus } from '../schemes/entities/application.entity';
import { CreateSchemeDto } from './dto/create-scheme.dto';
import { UpdateSchemeDto } from './dto/update-scheme.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class AdminSchemesService {
    constructor(
        @InjectRepository(Scheme)
        private readonly schemeRepository: Repository<Scheme>,
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
    ) { }

    async createScheme(dto: CreateSchemeDto): Promise<Scheme> {
        const scheme = this.schemeRepository.create(dto);
        return this.schemeRepository.save(scheme);
    }

    async updateScheme(id: string, dto: UpdateSchemeDto): Promise<Scheme> {
        const scheme = await this.schemeRepository.findOne({ where: { id } });
        if (!scheme) {
            throw new NotFoundException(`Scheme with ID ${id} not found`);
        }

        Object.assign(scheme, dto);
        return this.schemeRepository.save(scheme);
    }

    async deleteScheme(id: string): Promise<void> {
        const result = await this.schemeRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Scheme with ID ${id} not found`);
        }
    }

    async findAllApplications(page = 1, limit = 10, status?: ApplicationStatus) {
        const skip = (page - 1) * limit;

        const queryBuilder = this.applicationRepository.createQueryBuilder('application')
            .leftJoinAndSelect('application.scheme', 'scheme')
            .skip(skip)
            .take(limit)
            .orderBy('application.createdAt', 'DESC');

        if (status) {
            queryBuilder.andWhere('application.status = :status', { status });
        }

        const [data, total] = await queryBuilder.getManyAndCount();

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

    async updateApplicationStatus(id: string, dto: UpdateApplicationStatusDto, adminId: string): Promise<Application> {
        const application = await this.applicationRepository.findOne({
            where: { id },
            relations: ['scheme'],
        });

        if (!application) {
            throw new NotFoundException(`Application with ID ${id} not found`);
        }

        application.status = dto.status;
        application.reviewedBy = adminId;
        application.reviewedAt = new Date();

        if (dto.status === ApplicationStatus.REJECTED && dto.rejectionReason) {
            application.rejectionReason = dto.rejectionReason;
        }

        if (dto.status === ApplicationStatus.DISBURSED) {
            application.disbursedAmount = dto.disbursedAmount || application.scheme.benefitAmount;
            application.disbursedAt = new Date();
        }

        return this.applicationRepository.save(application);
    }

    async getStats() {
        const totalSchemes = await this.schemeRepository.count();
        const activeSchemes = await this.schemeRepository.count({ where: { isActive: true } });
        const totalApplications = await this.applicationRepository.count();

        const statusCounts = await this.applicationRepository
            .createQueryBuilder('application')
            .select('application.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('application.status')
            .getRawMany();

        const categoryCounts = await this.schemeRepository
            .createQueryBuilder('scheme')
            .select('scheme.category', 'category')
            .addSelect('COUNT(*)', 'count')
            .groupBy('scheme.category')
            .getRawMany();

        return {
            totalSchemes,
            activeSchemes,
            totalApplications,
            applicationsByStatus: statusCounts,
            schemesByCategory: categoryCounts,
        };
    }
}
