import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheme } from './entities/scheme.entity';
import { Application } from './entities/application.entity';
import { SchemesService } from './schemes.service';
import { SchemesController } from './schemes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Scheme, Application])],
  controllers: [SchemesController],
  providers: [SchemesService],
  exports: [SchemesService],
})
export class SchemesModule {}
