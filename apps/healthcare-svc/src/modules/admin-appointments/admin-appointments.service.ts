import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../appointments/entities/appointment.entity';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { QueryAppointmentDto } from '../appointments/dto/query-appointment.dto';

@Injectable()
export class AdminAppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>,
    ) { }

    async findAll(query: QueryAppointmentDto) {
        const { doctorId, hospitalId, status, fromDate, toDate, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.doctor', 'doctor')
            .leftJoinAndSelect('appointment.hospital', 'hospital')
            .skip(skip)
            .take(limit)
            .orderBy('appointment.appointmentDate', 'DESC');

        if (doctorId) queryBuilder.andWhere('appointment.doctorId = :doctorId', { doctorId });
        if (hospitalId) queryBuilder.andWhere('appointment.hospitalId = :hospitalId', { hospitalId });
        if (status) queryBuilder.andWhere('appointment.status = :status', { status });
        if (fromDate) queryBuilder.andWhere('appointment.appointmentDate >= :fromDate', { fromDate });
        if (toDate) queryBuilder.andWhere('appointment.appointmentDate <= :toDate', { toDate });

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

    async findOne(id: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({
            where: { id },
            relations: ['doctor', 'hospital'],
        });

        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`);
        }

        return appointment;
    }

    async updateStatus(id: string, dto: UpdateAppointmentStatusDto): Promise<Appointment> {
        const appointment = await this.findOne(id);

        appointment.status = dto.status;
        if (dto.cancellationReason && dto.status === AppointmentStatus.CANCELLED) {
            appointment.cancellationReason = dto.cancellationReason;
            appointment.cancelledAt = new Date();
        }

        return this.appointmentRepository.save(appointment);
    }

    async getStats() {
        const statusCounts = await this.appointmentRepository
            .createQueryBuilder('appointment')
            .select('appointment.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('appointment.status')
            .getRawMany();

        return statusCounts;
    }
}
