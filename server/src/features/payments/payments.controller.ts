import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './payment.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('my')
  getMyPayments(@MyId() myId: number): Promise<Payment[]> {
    return this.paymentsService.getMyPayments(myId);
  }

  @Roles(Role.BANKER)
  @Get('all')
  getAllPayments(): Promise<Payment[]> {
    return this.paymentsService.getAllPayments();
  }

  @Post()
  createPayment(
    @MyId() myId: number,
    @Body() dto: CreatePaymentDto,
  ): Promise<void> {
    return this.paymentsService.createPayment({ ...dto, myId });
  }
}
