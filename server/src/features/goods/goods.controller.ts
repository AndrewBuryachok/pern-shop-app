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
import { CreateGoodDto, EditGoodDto, GoodIdDto } from './good.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
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

  @Roles(Role.MANAGER)
  @Get('all')
  getAllGoods(@Query() req: Request): Promise<Response<Good>> {
    return this.goodsService.getAllGoods(req);
  }

  @Post()
  createGood(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Body() dto: CreateGoodDto,
  ): Promise<void> {
    return this.goodsService.createGood({ ...dto, myId, hasRole });
  }

  @Patch(':goodId')
  editGood(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { goodId }: GoodIdDto,
    @Body() dto: EditGoodDto,
  ): Promise<void> {
    return this.goodsService.editGood({ ...dto, goodId, myId, hasRole });
  }

  @Delete(':goodId')
  deleteGood(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { goodId }: GoodIdDto,
  ): Promise<void> {
    return this.goodsService.deleteGood({ goodId, myId, hasRole });
  }
}
