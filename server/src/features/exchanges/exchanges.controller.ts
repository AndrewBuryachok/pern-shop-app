import { Controller, Get } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { Exchange } from './exchange.entity';

@Controller('exchanges')
export class ExchangesController {
  constructor(private exchangesService: ExchangesService) {}

  @Get('my')
  getMyExchanges(myId: number): Promise<Exchange[]> {
    return this.exchangesService.getMyExchanges(myId);
  }

  @Get('all')
  getAllExchanges(): Promise<Exchange[]> {
    return this.exchangesService.getAllExchanges();
  }
}
