import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IgnorersService } from './ignorers.service';
import { User } from '../users/user.entity';
import { UserIdDto } from '../users/user.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, MyNick } from '../../common/decorators';

@ApiTags('ignorers')
@Controller('ignorers')
export class IgnorersController {
  constructor(private ignorersService: IgnorersService) {}

  @Get('my')
  getMyIgnorers(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.ignorersService.getMyIgnorers(myId, req);
  }

  @Get('received')
  getReceivedIgnorers(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.ignorersService.getReceivedIgnorers(myId, req);
  }

  @Get('my/select')
  selectMyIgnorers(@MyId() myId: number): Promise<User[]> {
    return this.ignorersService.selectMyIgnorers(myId);
  }

  @Post(':userId')
  addIgnorer(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.ignorersService.addIgnorer({ userId, myId, nick });
  }

  @Delete(':userId')
  removeIgnorer(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.ignorersService.removeIgnorer({ userId, myId, nick });
  }
}
