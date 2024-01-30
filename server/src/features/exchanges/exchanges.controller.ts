import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExchangesService } from './exchanges.service';
import { Exchange } from './exchange.entity';
import { CreateExchangeDto } from './exchange.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, MyNick, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('exchanges')
@Controller('exchanges')
export class ExchangesController {
  constructor(private exchangesService: ExchangesService) {}

  @Get('my')
  getMyExchanges(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Exchange>> {
    return this.exchangesService.getMyExchanges(myId, req);
  }

  @Roles(Role.BANKER)
  @Get('all')
  getAllExchanges(@Query() req: Request): Promise<Response<Exchange>> {
    return this.exchangesService.getAllExchanges(req);
  }

  @Roles(Role.BANKER)
  @Post()
  createExchange(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateExchangeDto,
  ): Promise<void> {
    return this.exchangesService.createExchange({ ...dto, myId, nick });
  }
}
