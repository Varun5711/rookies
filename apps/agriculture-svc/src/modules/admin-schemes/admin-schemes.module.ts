import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSchemesController } from './admin-schemes.controller';
import { AdminSchemesService } from './admin-schemes.service';
import { Scheme } from '../schemes/entities/scheme.entity';
import { Application } from '../schemes/entities/application.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Scheme, Application])],
    controllers: [AdminSchemesController],
    providers: [AdminSchemesService],
})
export class AdminSchemesModule { }
