import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BargainsService } from './bargains.service';
import { Bargain } from './bargain.entity';
import { CreateBargainDto, RateBargainDto, BargainIdDto } from './bargain.dto';
import { UserIdDto } from '../users/user.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('bargains')
@Controller('bargains')
export class BargainsController {
  constructor(private bargainsService: BargainsService) {}

  @Get('my')
  getMyBargains(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Bargain>> {
    return this.bargainsService.getMyBargains(myId, req);
  }

  @Get('sold')
  getSoldBargains(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Bargain>> {
    return this.bargainsService.getSoldBargains(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllBargains(@Query() req: Request): Promise<Response<Bargain>> {
    return this.bargainsService.getAllBargains(req);
  }

  @Get('my/select')
  selectMyBargains(@MyId() myId: number): Promise<Bargain[]> {
    return this.bargainsService.selectUserBargains(myId);
  }

  @Roles(Role.MERCHANT)
  @Get(':userId/select')
  selectUserBargains(@Param() { userId }: UserIdDto): Promise<Bargain[]> {
    return this.bargainsService.selectUserBargains(userId);
  }

  @Post()
  createBargain(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateBargainDto,
  ): Promise<void> {
    return this.bargainsService.createBargain({ ...dto, myId, nick, hasRole });
  }

  @Patch(':bargainId/rate')
  rateBargain(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { bargainId }: BargainIdDto,
    @Body() dto: RateBargainDto,
  ): Promise<void> {
    return this.bargainsService.rateBargain({
      ...dto,
      bargainId,
      myId,
      nick,
      hasRole,
    });
  }

  @Roles(Role.MERCHANT)
  @Delete(':bargainId')
  deleteBargain(@Param() { bargainId }: BargainIdDto): Promise<void> {
    return this.bargainsService.deleteBargain({ bargainId });
  }
}
