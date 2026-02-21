import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { CardsModule } from '../cards/cards.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { IsInvoiceExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    CardsModule,
    TransactionsModule,
    MqttModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, IsInvoiceExists],
  exports: [InvoicesService],
})
export class InvoicesModule {}
