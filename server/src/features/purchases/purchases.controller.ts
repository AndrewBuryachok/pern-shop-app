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
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/purchases')
@Controller(':project/purchases')
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get('my')
  getMyPurchases(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Purchase>> {
    return this.purchasesService.getMyPurchases(project, myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllPurchases(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Purchase>> {
    return this.purchasesService.getAllPurchases(project, req);
  }

  @Get('my/select')
  selectMyPurchases(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
  ): Promise<Purchase[]> {
    return this.purchasesService.selectUserPurchases(project, myId);
  }

  @Roles(Role.MODER)
  @Get(':userId/select')
  selectUserPurchases(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
  ): Promise<Purchase[]> {
    return this.purchasesService.selectUserPurchases(project, userId);
  }

  @Post()
  createPurchase(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreatePurchaseDto,
  ): Promise<void> {
    return this.purchasesService.createPurchase(project, {
      ...dto,
      myId,
      hasRole,
    });
  }

  @Roles(Role.MODER)
  @Delete(':purchaseId')
  deletePurchase(
    @Param() { project }: ProjectDto,
    @Param() { purchaseId }: PurchaseIdDto,
  ): Promise<void> {
    return this.purchasesService.deletePurchase(project, purchaseId);
  }
}
