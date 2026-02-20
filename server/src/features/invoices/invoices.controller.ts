import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoice.entity';
import {
  CompleteInvoiceDto,
  CreateInvoiceDto,
  EditInvoiceDto,
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

  @Roles(Role.MODER, Role.CONSUL)
  @Get('all')
  getAllInvoices(@Query() req: Request): Promise<Response<Invoice>> {
    return this.invoicesService.getAllInvoices(req);
  }

  @Post()
  createInvoice(
    @MyId() myId: number,
    @HasRole(Role.MODER, Role.CONSUL) hasRole: boolean,
    @Body() dto: CreateInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.createInvoice({ ...dto, myId, hasRole });
  }

  @Patch(':invoiceId')
  editInvoice(
    @MyId() myId: number,
    @HasRole(Role.MODER, Role.CONSUL) hasRole: boolean,
    @Param() { invoiceId }: InvoiceIdDto,
    @Body() dto: EditInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.editInvoice({
      ...dto,
      invoiceId,
      myId,
      hasRole,
    });
  }

  @Post(':invoiceId')
  completeInvoice(
    @MyId() myId: number,
    @HasRole(Role.MODER, Role.CONSUL) hasRole: boolean,
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

  @Delete(':invoiceId')
  deleteInvoice(
    @MyId() myId: number,
    @HasRole(Role.MODER, Role.CONSUL) hasRole: boolean,
    @Param() { invoiceId }: InvoiceIdDto,
  ): Promise<void> {
    return this.invoicesService.deleteInvoice({ invoiceId, myId, hasRole });
  }
}
