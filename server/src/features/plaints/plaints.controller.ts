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
import { PlaintsService } from './plaints.service';
import { Plaint } from './plaint.entity';
import { Answer } from '../answers/answer.entity';
import {
  CompletePlaintDto,
  CreatePlaintDto,
  EditPlaintDto,
  ExtCreatePlaintDto,
  PlaintIdDto,
} from './plaint.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('plaints')
@Controller('plaints')
export class PlaintsController {
  constructor(private plaintsService: PlaintsService) {}

  @Public()
  @Get()
  getMainPlaints(@Query() req: Request): Promise<Response<Plaint>> {
    return this.plaintsService.getMainPlaints(req);
  }

  @Get('my')
  getMyPlaints(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Plaint>> {
    return this.plaintsService.getMyPlaints(myId, req);
  }

  @Get('received')
  getReceivedPlaints(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Plaint>> {
    return this.plaintsService.getReceivedPlaints(myId, req);
  }

  @Get('answered')
  getAnsweredPlaints(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Plaint>> {
    return this.plaintsService.getAnsweredPlaints(myId, req);
  }

  @Roles(Role.JUDGE)
  @Get('all')
  getAllPlaints(@Query() req: Request): Promise<Response<Plaint>> {
    return this.plaintsService.getAllPlaints(req);
  }

  @Public()
  @Get(':plaintId/answers')
  selectPlaintAnswers(@Param() { plaintId }: PlaintIdDto): Promise<Answer[]> {
    return this.plaintsService.selectPlaintAnswers(plaintId);
  }

  @Post()
  createMyPlaint(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreatePlaintDto,
  ): Promise<void> {
    return this.plaintsService.createPlaint({
      ...dto,
      senderUserId: myId,
      nick,
    });
  }

  @Roles(Role.JUDGE)
  @Post('all')
  createUserPlaint(
    @MyNick() nick: string,
    @Body() dto: ExtCreatePlaintDto,
  ): Promise<void> {
    return this.plaintsService.createPlaint({ ...dto, nick });
  }

  @Patch(':plaintId')
  editPlaint(
    @MyId() myId: number,
    @HasRole(Role.JUDGE) hasRole: boolean,
    @Param() { plaintId }: PlaintIdDto,
    @Body() dto: EditPlaintDto,
  ): Promise<void> {
    return this.plaintsService.editPlaint({ ...dto, plaintId, myId, hasRole });
  }

  @Roles(Role.JUDGE)
  @Post(':plaintId')
  completePlaint(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { plaintId }: PlaintIdDto,
    @Body() dto: CompletePlaintDto,
  ): Promise<void> {
    return this.plaintsService.completePlaint({ ...dto, plaintId, myId, nick });
  }

  @Delete(':plaintId')
  deletePlaint(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.JUDGE) hasRole: boolean,
    @Param() { plaintId }: PlaintIdDto,
  ): Promise<void> {
    return this.plaintsService.deletePlaint({ plaintId, myId, nick, hasRole });
  }
}
