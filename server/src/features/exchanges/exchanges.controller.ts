import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExchangesService } from './exchanges.service';
import { Exchange } from './exchange.entity';
import { CreateExchangeDto, ExchangeIdDto } from './exchange.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Roles } from '../../common/decorators';
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

  @Post()
  createExchange(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.BANKER) hasRole: boolean,
    @Body() dto: CreateExchangeDto,
  ): Promise<void> {
    return this.exchangesService.createExchange({
      ...dto,
      myId,
      nick,
      hasRole,
    });
  }

  @Roles(Role.BANKER)
  @Delete(':exchangeId')
  deleteExchange(@Param() { exchangeId }: ExchangeIdDto): Promise<void> {
    return this.exchangesService.deleteExchange(exchangeId);
  }
}
