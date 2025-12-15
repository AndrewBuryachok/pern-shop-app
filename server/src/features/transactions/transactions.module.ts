import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Transaction } from './transaction.entity';
import { CardsModule } from '../cards/cards.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { IsTransactionExists } from '../../common/constraints';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Transaction], db),
    ),
    CardsModule,
    MqttModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, IsTransactionExists],
  exports: [TransactionsService],
})
export class TransactionsModule {}
