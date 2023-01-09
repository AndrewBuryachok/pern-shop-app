import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { Good } from './good.entity';
import { CreateGoodDto, GoodIdDto } from './good.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('goods')
export class GoodsController {
  constructor(private goodsService: GoodsService) {}

  @Get()
  getMainGoods(): Promise<Good[]> {
    return this.goodsService.getMainGoods();
  }

  @Get('my')
  getMyGoods(@MyId() myId: number): Promise<Good[]> {
    return this.goodsService.getMyGoods(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllGoods(): Promise<Good[]> {
    return this.goodsService.getAllGoods();
  }

  @Post()
  createGood(@MyId() myId: number, @Body() dto: CreateGoodDto): Promise<void> {
    return this.goodsService.createGood({ ...dto, myId });
  }

  @Delete(':goodId')
  deleteGood(
    @MyId() myId: number,
    @Param() { goodId }: GoodIdDto,
  ): Promise<void> {
    return this.goodsService.deleteGood({ goodId, myId });
  }
}
