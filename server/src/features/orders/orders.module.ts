import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { LeasesModule } from '../leases/leases.module';
import { CardsModule } from '../cards/cards.module';
import { PaymentsModule } from '../payments/payments.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { IsOrderExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    LeasesModule,
    CardsModule,
    PaymentsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, IsOrderExists],
  exports: [OrdersService],
})
export class OrdersModule {}
