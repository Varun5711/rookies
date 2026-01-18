import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGrievancesController } from './admin-grievances.controller';
import { AdminGrievancesService } from './admin-grievances.service';
import { Grievance } from '../grievances/entities/grievance.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Grievance])],
    controllers: [AdminGrievancesController],
    providers: [AdminGrievancesService],
})
export class AdminGrievancesModule { }
