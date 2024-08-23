import {
  Body,
  Controller,
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
import { CreateGoodDto, EditGoodDto, GoodIdDto } from './good.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('goods')
@Controller('goods')
export class GoodsController {
  constructor(private goodsService: GoodsService) {}

  @Public()
  @Get()
  getMainGoods(@Query() req: Request): Promise<Response<Good>> {
    return this.goodsService.getMainGoods(req);
  }

  @Get('my')
  getMyGoods(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Good>> {
    return this.goodsService.getMyGoods(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllGoods(@Query() req: Request): Promise<Response<Good>> {
    return this.goodsService.getAllGoods(req);
  }

  @Public()
  @Get(':goodId/states')
  selectGoodStates(@Param() { goodId }: GoodIdDto): Promise<GoodState[]> {
    return this.goodsService.selectGoodStates(goodId);
  }

  @Public()
  @Get(':goodId/rating')
  selectGoodRating(@Param() { goodId }: GoodIdDto): Promise<{ rate: number }> {
    return this.goodsService.selectGoodRating(goodId);
  }

  @Post()
  createGood(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateGoodDto,
  ): Promise<void> {
    return this.goodsService.createGood({ ...dto, myId, nick, hasRole });
  }

  @Patch(':goodId')
  editGood(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { goodId }: GoodIdDto,
    @Body() dto: EditGoodDto,
  ): Promise<void> {
    return this.goodsService.editGood({ ...dto, goodId, myId, hasRole });
  }

  @Post(':goodId')
  completeGood(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { goodId }: GoodIdDto,
  ): Promise<void> {
    return this.goodsService.completeGood({ goodId, myId, hasRole });
  }
}
