import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LotsService } from './lots.service';
import { Lot } from './lot.entity';
import { Bid } from '../bids/bid.entity';
import { CreateLotDto, LotIdDto } from './lot.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('lots')
@Controller('lots')
export class LotsController {
  constructor(private lotsService: LotsService) {}

  @Public()
  @Get()
  getMainLots(@Query() req: Request): Promise<Response<Lot>> {
    return this.lotsService.getMainLots(req);
  }

  @Get('my')
  getMyLots(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Lot>> {
    return this.lotsService.getMyLots(myId, req);
  }

  @Get('placed')
  getPlacedLots(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Lot>> {
    return this.lotsService.getPlacedLots(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllLots(@Query() req: Request): Promise<Response<Lot>> {
    return this.lotsService.getAllLots(req);
  }

  @Public()
  @Get(':lotId/bids')
  selectLotBids(@Param() { lotId }: LotIdDto): Promise<Bid[]> {
    return this.lotsService.selectLotBids(lotId);
  }

  @Post()
  createLot(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Body() dto: CreateLotDto,
  ): Promise<void> {
    return this.lotsService.createLot({ ...dto, myId, nick, hasRole });
  }

  @Post(':lotId')
  completeLot(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { lotId }: LotIdDto,
  ): Promise<void> {
    return this.lotsService.completeLot({ lotId, myId, nick, hasRole });
  }
}
