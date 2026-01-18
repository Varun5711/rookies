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
        const scheme = this.schemeRepository.create({
            ...dto,
            startDate: dto.startDate ? new Date(dto.startDate) : undefined,
            endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        });
        return this.schemeRepository.save(scheme);
    }

    async updateScheme(id: string, dto: UpdateSchemeDto): Promise<Scheme> {
        const scheme = await this.schemeRepository.findOne({ where: { id } });
        if (!scheme) throw new NotFoundException('Scheme not found');

        Object.assign(scheme, dto);
        if (dto.startDate) scheme.startDate = new Date(dto.startDate);
        if (dto.endDate) scheme.endDate = new Date(dto.endDate);

        return this.schemeRepository.save(scheme);
    }

    async deleteScheme(id: string): Promise<void> {
        const result = await this.schemeRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Scheme not found');
    }

    async findAllApplications(page = 1, limit = 10, status?: string) {
        const query = this.applicationRepository.createQueryBuilder('application')
            .leftJoinAndSelect('application.scheme', 'scheme')
            .orderBy('application.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        if (status) {
            query.andWhere('application.status = :status', { status });
        }

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async updateApplicationStatus(id: string, dto: UpdateApplicationStatusDto, adminId?: string): Promise<Application> {
        const application = await this.applicationRepository.findOne({ where: { id } });
        if (!application) throw new NotFoundException('Application not found');

        application.status = dto.status;
        if (dto.rejectionReason) application.rejectionReason = dto.rejectionReason;
        if (dto.disbursedAmount) {
            application.disbursedAmount = dto.disbursedAmount;
            application.disbursedAt = new Date();
        }
        application.reviewedBy = adminId;
        application.reviewedAt = new Date();

        if (dto.status === ApplicationStatus.APPROVED && application.schemeId) {
            // Increment utilized budget? Logic could be here.
        }

        return this.applicationRepository.save(application);
    }

    async getStats() {
        const schemeCount = await this.schemeRepository.count();
        const applicationStats = await this.applicationRepository.createQueryBuilder('app')
            .select('app.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('app.status')
            .getRawMany();

        return {
            totalSchemes: schemeCount,
            applicationStats
        };
    }
}
