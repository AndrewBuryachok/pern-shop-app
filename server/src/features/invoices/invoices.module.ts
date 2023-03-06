import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { CardsModule } from '../cards/cards.module';
import { PaymentsModule } from '../payments/payments.module';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { IsInvoiceExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), CardsModule, PaymentsModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, IsInvoiceExists],
})
export class InvoicesModule {}
