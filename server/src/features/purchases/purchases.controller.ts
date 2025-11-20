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
import { PurchasesService } from './purchases.service';
import { Purchase } from './purchase.entity';
import { CreatePurchaseDto, PurchaseIdDto } from './purchase.dto';
import { UserIdDto } from '../users/user.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get('my')
  getMyPurchases(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Purchase>> {
    return this.purchasesService.getMyPurchases(myId, req);
  }

  @Get('sold')
  getSoldPurchases(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Purchase>> {
    return this.purchasesService.getSoldPurchases(myId, req);
  }

  @Get('placed')
  getPlacedPurchases(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Purchase>> {
    return this.purchasesService.getPlacedPurchases(myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllPurchases(@Query() req: Request): Promise<Response<Purchase>> {
    return this.purchasesService.getAllPurchases(req);
  }

  @Get('my/select')
  selectMyPurchases(@MyId() myId: number): Promise<Purchase[]> {
    return this.purchasesService.selectUserPurchases(myId);
  }

  @Roles(Role.MODER)
  @Get(':userId/select')
  selectUserPurchases(@Param() { userId }: UserIdDto): Promise<Purchase[]> {
    return this.purchasesService.selectUserPurchases(userId);
  }

  @Post()
  createPurchase(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreatePurchaseDto,
  ): Promise<void> {
    return this.purchasesService.createPurchase({ ...dto, myId, hasRole });
  }

  @Roles(Role.MODER)
  @Delete(':purchaseId')
  deletePurchase(@Param() { purchaseId }: PurchaseIdDto): Promise<void> {
    return this.purchasesService.deletePurchase(purchaseId);
  }
}
