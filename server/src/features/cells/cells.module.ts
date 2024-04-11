import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cell } from './cell.entity';
import { StoragesTagsModule } from '../storages-tags/storages-tags.module';
import { PaymentsModule } from '../payments/payments.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { CellsController } from './cells.controller';
import { CellsService } from './cells.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cell]),
    StoragesTagsModule,
    PaymentsModule,
    MqttModule,
  ],
  controllers: [CellsController],
  providers: [CellsService],
  exports: [CellsService],
})
export class CellsModule {}
