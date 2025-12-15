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
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/invoices')
@Controller(':project/invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get('my')
  getMyInvoices(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Invoice>> {
    return this.invoicesService.getMyInvoices(project, myId, req);
  }

  @Roles(Role.MODER, Role.CONSUL)
  @Get('all')
  getAllInvoices(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Invoice>> {
    return this.invoicesService.getAllInvoices(project, req);
  }

  @Post()
  createInvoice(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER, Role.CONSUL) hasRole: boolean,
    @Body() dto: CreateInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.createInvoice(project, {
      ...dto,
      myId,
      hasRole,
    });
  }

  @Patch(':invoiceId')
  editInvoice(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER, Role.CONSUL) hasRole: boolean,
    @Param() { invoiceId }: InvoiceIdDto,
    @Body() dto: EditInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.editInvoice(project, {
      ...dto,
      invoiceId,
      myId,
      hasRole,
    });
  }

  @Post(':invoiceId')
  completeInvoice(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER, Role.CONSUL) hasRole: boolean,
    @Param() { invoiceId }: InvoiceIdDto,
    @Body() dto: CompleteInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.completeInvoice(project, {
      ...dto,
      invoiceId,
      myId,
      hasRole,
    });
  }

  @Delete(':invoiceId')
  deleteInvoice(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER, Role.CONSUL) hasRole: boolean,
    @Param() { invoiceId }: InvoiceIdDto,
  ): Promise<void> {
    return this.invoicesService.deleteInvoice(project, {
      invoiceId,
      myId,
      hasRole,
    });
  }
}
