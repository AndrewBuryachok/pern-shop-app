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
import { GoodsService } from './goods.service';
import { Good } from './good.entity';
import { GoodState } from './good-state.entity';
import { Purchase } from '../purchases/purchase.entity';
import {
  CreateGoodDto,
  EditGoodDto,
  GoodIdDto,
  UpdateGoodDto,
} from './good.dto';
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/goods')
@Controller(':project/goods')
export class GoodsController {
  constructor(private goodsService: GoodsService) {}

  @Public()
  @Get()
  getMainGoods(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Good>> {
    return this.goodsService.getMainGoods(project, req);
  }

  @Get('my')
  getMyGoods(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Good>> {
    return this.goodsService.getMyGoods(project, myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllGoods(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Good>> {
    return this.goodsService.getAllGoods(project, req);
  }

  @Public()
  @Get(':goodId/states')
  selectGoodStates(
    @Param() { project }: ProjectDto,
    @Param() { goodId }: GoodIdDto,
  ): Promise<GoodState[]> {
    return this.goodsService.selectGoodStates(project, goodId);
  }

  @Public()
  @Get(':goodId/purchases')
  selectGoodPurchases(
    @Param() { project }: ProjectDto,
    @Param() { goodId }: GoodIdDto,
  ): Promise<Purchase[]> {
    return this.goodsService.selectGoodPurchases(project, goodId);
  }

  @Post()
  createGood(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreateGoodDto,
  ): Promise<void> {
    return this.goodsService.createGood(project, { ...dto, myId, hasRole });
  }

  @Patch(':goodId')
  editGood(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { goodId }: GoodIdDto,
    @Body() dto: EditGoodDto,
  ): Promise<void> {
    return this.goodsService.editGood(project, {
      ...dto,
      goodId,
      myId,
      hasRole,
    });
  }

  @Patch(':goodId/states')
  updateGood(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { goodId }: GoodIdDto,
    @Body() dto: UpdateGoodDto,
  ): Promise<void> {
    return this.goodsService.updateGood(project, {
      ...dto,
      goodId,
      myId,
      hasRole,
    });
  }

  @Post(':goodId')
  completeGood(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { goodId }: GoodIdDto,
  ): Promise<void> {
    return this.goodsService.completeGood(project, { goodId, myId, hasRole });
  }

  @Delete(':goodId')
  deleteGood(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { goodId }: GoodIdDto,
  ): Promise<void> {
    return this.goodsService.deleteGood(project, { goodId, myId, hasRole });
  }
}
