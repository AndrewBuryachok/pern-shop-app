import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cell } from './cell.entity';
import { StoragesTagsModule } from '../storages-tags/storages-tags.module';
import { PaymentsModule } from '../payments/payments.module';
import { CellsController } from './cells.controller';
import { CellsService } from './cells.service';
import { IsCellExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cell]),
    StoragesTagsModule,
    PaymentsModule,
  ],
  controllers: [CellsController],
  providers: [CellsService, IsCellExists],
  exports: [CellsService],
})
export class CellsModule {}
