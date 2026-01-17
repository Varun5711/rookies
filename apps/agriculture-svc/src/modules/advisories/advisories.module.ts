import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advisory } from './entities/advisory.entity';
import { AdvisoriesService } from './advisories.service';
import { AdvisoriesController } from './advisories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Advisory])],
  controllers: [AdvisoriesController],
  providers: [AdvisoriesService],
  exports: [AdvisoriesService],
})
export class AdvisoriesModule {}
