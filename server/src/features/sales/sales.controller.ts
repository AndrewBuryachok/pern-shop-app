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
import { SalesService } from './sales.service';
import { Sale } from './sale.entity';
import { CreateSaleDto, RateSaleDto, SaleIdDto } from './sale.dto';
import { UserIdDto } from '../users/user.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get('my')
  getMySales(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Sale>> {
    return this.salesService.getMySales(myId, req);
  }

  @Get('sold')
  getSoldSales(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Sale>> {
    return this.salesService.getSoldSales(myId, req);
  }

  @Get('placed')
  getPlacedSales(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Sale>> {
    return this.salesService.getPlacedSales(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllSales(@Query() req: Request): Promise<Response<Sale>> {
    return this.salesService.getAllSales(req);
  }

  @Get('my/select')
  selectMySales(@MyId() myId: number): Promise<Sale[]> {
    return this.salesService.selectUserSales(myId);
  }

  @Roles(Role.MERCHANT)
  @Get(':userId/select')
  selectUserSales(@Param() { userId }: UserIdDto): Promise<Sale[]> {
    return this.salesService.selectUserSales(userId);
  }

  @Post()
  createSale(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateSaleDto,
  ): Promise<void> {
    return this.salesService.createSale({ ...dto, myId, nick, hasRole });
  }

  @Patch(':saleId/rate')
  rateSale(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { saleId }: SaleIdDto,
    @Body() dto: RateSaleDto,
  ): Promise<void> {
    return this.salesService.rateSale({ ...dto, saleId, myId, nick, hasRole });
  }

  @Roles(Role.MERCHANT)
  @Delete(':saleId')
  deleteSale(@Param() { saleId }: SaleIdDto): Promise<void> {
    return this.salesService.deleteSale({ saleId });
  }
}
