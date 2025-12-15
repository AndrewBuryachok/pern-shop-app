import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Order } from './order.entity';
import { CardsModule } from '../cards/cards.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { IsOrderExists } from '../../common/constraints';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Order], db),
    ),
    CardsModule,
    TransactionsModule,
    MqttModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, IsOrderExists],
  exports: [OrdersService],
})
export class OrdersModule {}
