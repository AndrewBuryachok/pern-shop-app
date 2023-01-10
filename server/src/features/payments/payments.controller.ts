import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './payment.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('my')
  getMyPayments(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Payment>> {
    return this.paymentsService.getMyPayments(myId, req);
  }

  @Roles(Role.BANKER)
  @Get('all')
  getAllPayments(@Query() req: Request): Promise<Response<Payment>> {
    return this.paymentsService.getAllPayments(req);
  }

  @Post()
  createPayment(
    @MyId() myId: number,
    @Body() dto: CreatePaymentDto,
  ): Promise<void> {
    return this.paymentsService.createPayment({ ...dto, myId });
  }
}
