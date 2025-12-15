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
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/transactions')
@Controller(':project/transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get('my')
  getMyTransactions(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Transaction>> {
    return this.transactionsService.getMyTransactions(project, myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllTransactions(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Transaction>> {
    return this.transactionsService.getAllTransactions(project, req);
  }

  @Roles(Role.MODER)
  @Post('deposit')
  createDeposit(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Body() dto: CreateTransactionDto,
  ): Promise<void> {
    return this.transactionsService.createDeposit(project, myId, dto);
  }

  @Roles(Role.MODER)
  @Post('withdraw')
  createWithdraw(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Body() dto: CreateTransactionDto,
  ): Promise<void> {
    return this.transactionsService.createWithdraw(project, myId, dto);
  }

  @Post('transfer')
  createTransfer(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreateTransferDto,
  ): Promise<void> {
    return this.transactionsService.createTransfer(project, {
      ...dto,
      myId,
      hasRole,
    });
  }

  @Roles(Role.MODER)
  @Delete(':transactionId')
  deleteTransaction(
    @Param() { project }: ProjectDto,
    @Param() { transactionId }: TransactionIdDto,
  ): Promise<void> {
    return this.transactionsService.deleteTransaction(project, transactionId);
  }
}
