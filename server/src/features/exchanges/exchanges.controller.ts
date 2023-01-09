import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { Exchange } from './exchange.entity';
import { CreateExchangeDto } from './exchange.dto';

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

  @Post()
  createExchange(myId: number, @Body() dto: CreateExchangeDto): Promise<void> {
    return this.exchangesService.createExchange({ ...dto, myId });
  }
}
