import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('my')
  getMyPayments(myId: number): Promise<Payment[]> {
    return this.paymentsService.getMyPayments(myId);
  }

  @Get('all')
  getAllPayments(): Promise<Payment[]> {
    return this.paymentsService.getAllPayments();
  }

  @Post()
  createPayment(myId: number, @Body() dto: CreatePaymentDto): Promise<void> {
    return this.paymentsService.createPayment({ ...dto, myId });
  }
}
