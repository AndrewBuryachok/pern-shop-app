import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ware } from './ware.entity';
import { WaresController } from './wares.controller';
import { WaresService } from './wares.service';
import { IsWareExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Ware])],
  controllers: [WaresController],
  providers: [WaresService, IsWareExists],
})
export class WaresModule {}
