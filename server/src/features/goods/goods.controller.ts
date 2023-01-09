import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { Good } from './good.entity';
import { CreateGoodDto, GoodIdDto } from './good.dto';

@Controller('goods')
export class GoodsController {
  constructor(private goodsService: GoodsService) {}

  @Get()
  getMainGoods(): Promise<Good[]> {
    return this.goodsService.getMainGoods();
  }

  @Get('my')
  getMyGoods(myId: number): Promise<Good[]> {
    return this.goodsService.getMyGoods(myId);
  }

  @Get('all')
  getAllGoods(): Promise<Good[]> {
    return this.goodsService.getAllGoods();
  }

  @Post()
  createGood(myId: number, @Body() dto: CreateGoodDto): Promise<void> {
    return this.goodsService.createGood({ ...dto, myId });
  }

  @Delete(':goodId')
  deleteGood(myId: number, @Param() { goodId }: GoodIdDto): Promise<void> {
    return this.goodsService.deleteGood({ goodId, myId });
  }
}
