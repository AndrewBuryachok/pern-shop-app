import { Controller, Get } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { Good } from './good.entity';

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
}
