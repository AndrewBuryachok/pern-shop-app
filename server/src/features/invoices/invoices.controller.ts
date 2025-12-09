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
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoice.entity';
import {
  CompleteInvoiceDto,
  CreateInvoiceDto,
  InvoiceIdDto,
} from './invoice.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get('my')
  getMyInvoices(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Invoice>> {
    return this.invoicesService.getMyInvoices(myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllInvoices(@Query() req: Request): Promise<Response<Invoice>> {
    return this.invoicesService.getAllInvoices(req);
  }

  @Roles(Role.MODER)
  @Post()
  createInvoice(
    @MyId() myId: number,
    @Body() dto: CreateInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.createInvoice({ ...dto, myId });
  }

  @Post(':invoiceId')
  completeInvoice(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { invoiceId }: InvoiceIdDto,
    @Body() dto: CompleteInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.completeInvoice({
      ...dto,
      invoiceId,
      myId,
      hasRole,
    });
  }

  @Roles(Role.MODER)
  @Delete(':invoiceId')
  deleteInvoice(@Param() { invoiceId }: InvoiceIdDto): Promise<void> {
    return this.invoicesService.deleteInvoice(invoiceId);
  }
}
