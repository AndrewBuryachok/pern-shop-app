import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { Exchange } from './exchange.entity';
import { CreateExchangeDto } from './exchange.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('exchanges')
export class ExchangesController {
  constructor(private exchangesService: ExchangesService) {}

  @Get('my')
  getMyExchanges(@MyId() myId: number): Promise<Exchange[]> {
    return this.exchangesService.getMyExchanges(myId);
  }

  @Roles(Role.BANKER)
  @Get('all')
  getAllExchanges(): Promise<Exchange[]> {
    return this.exchangesService.getAllExchanges();
  }

  @Roles(Role.BANKER)
  @Post()
  createExchange(
    @MyId() myId: number,
    @Body() dto: CreateExchangeDto,
  ): Promise<void> {
    return this.exchangesService.createExchange({ ...dto, myId });
  }
}
