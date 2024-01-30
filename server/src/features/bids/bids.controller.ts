import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BidsService } from './bids.service';
import { Bid } from './bid.entity';
import { CreateBidDto } from './bid.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('bids')
@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @Get('my')
  getMyBids(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Bid>> {
    return this.bidsService.getMyBids(myId, req);
  }

  @Get('sold')
  getSoldBids(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Bid>> {
    return this.bidsService.getSoldBids(myId, req);
  }

  @Get('placed')
  getPlacedBids(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Bid>> {
    return this.bidsService.getPlacedBids(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllBids(@Query() req: Request): Promise<Response<Bid>> {
    return this.bidsService.getAllBids(req);
  }

  @Post()
  createBid(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Body() dto: CreateBidDto,
  ): Promise<void> {
    return this.bidsService.createBid({ ...dto, myId, nick, hasRole });
  }
}
