import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grievance } from './entities/grievance.entity';
import { Category } from '../categories/entities/category.entity';
import { GrievancesService } from './grievances.service';
import { GrievancesController } from './grievances.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Grievance, Category])],
  controllers: [GrievancesController],
  providers: [GrievancesService],
  exports: [GrievancesService],
})
export class GrievancesModule {}
