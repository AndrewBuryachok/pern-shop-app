import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';

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
}
