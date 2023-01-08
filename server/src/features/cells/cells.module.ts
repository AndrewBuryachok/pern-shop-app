import { Module } from '@nestjs/common';
import { CellsController } from './cells.controller';
import { CellsService } from './cells.service';

@Module({
  controllers: [CellsController],
  providers: [CellsService],
})
export class CellsModule {}
