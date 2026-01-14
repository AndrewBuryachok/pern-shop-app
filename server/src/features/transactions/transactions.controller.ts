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
import { CreateTransferDto, TransactionIdDto } from './transaction.dto';
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

  @Post()
  createTransaction(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreateTransferDto,
  ): Promise<void> {
    return this.transactionsService.createTransaction({
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
