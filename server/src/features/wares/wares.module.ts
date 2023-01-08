import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ware } from './ware.entity';
import { WaresController } from './wares.controller';
import { WaresService } from './wares.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ware])],
  controllers: [WaresController],
  providers: [WaresService],
})
export class WaresModule {}
