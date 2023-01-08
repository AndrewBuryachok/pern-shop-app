import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cell } from './cell.entity';
import { CellsController } from './cells.controller';
import { CellsService } from './cells.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cell])],
  controllers: [CellsController],
  providers: [CellsService],
})
export class CellsModule {}
