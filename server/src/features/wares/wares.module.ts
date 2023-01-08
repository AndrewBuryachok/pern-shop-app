import { Module } from '@nestjs/common';
import { WaresController } from './wares.controller';
import { WaresService } from './wares.service';

@Module({
  controllers: [WaresController],
  providers: [WaresService],
})
export class WaresModule {}
