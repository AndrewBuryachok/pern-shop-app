import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { CellsModule } from '../cells/cells.module';
import { CardsModule } from '../cards/cards.module';
import { PaymentsModule } from '../payments/payments.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { IsOrderExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    CellsModule,
    CardsModule,
    PaymentsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, IsOrderExists],
  exports: [OrdersService],
})
export class OrdersModule {}
