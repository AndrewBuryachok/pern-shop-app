import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import {
  CreateTransactionDto,
  CreateTransferDto,
  TransactionIdDto,
} from './transaction.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get('my')
  getMyTransactions(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Transaction>> {
    return this.transactionsService.getMyTransactions(myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllTransactions(@Query() req: Request): Promise<Response<Transaction>> {
    return this.transactionsService.getAllTransactions(req);
  }

  @Roles(Role.MODER)
  @Post('deposit')
  createDeposit(
    @MyId() myId: number,
    @Body() dto: CreateTransactionDto,
  ): Promise<void> {
    return this.transactionsService.createDeposit(myId, dto);
  }

  @Roles(Role.MODER)
  @Post('withdraw')
  createWithdraw(
    @MyId() myId: number,
    @Body() dto: CreateTransactionDto,
  ): Promise<void> {
    return this.transactionsService.createWithdraw(myId, dto);
  }

  @Post('transfer')
  createTransfer(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreateTransferDto,
  ): Promise<void> {
    return this.transactionsService.createTransfer({
      ...dto,
      myId,
      hasRole,
    });
  }

  @Roles(Role.MODER)
  @Delete(':transactionId')
  deleteTransaction(
    @Param() { transactionId }: TransactionIdDto,
  ): Promise<void> {
    return this.transactionsService.deleteTransaction(transactionId);
  }
}
