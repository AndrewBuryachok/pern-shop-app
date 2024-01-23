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
import { PlaintsService } from './plaints.service';
import { Plaint } from './plaint.entity';
import {
  CreatePlaintDto,
  ExtCreatePlaintDto,
  PlaintIdDto,
  UpdatePlaintDto,
} from './plaint.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
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

  @Roles(Role.JUDGE)
  @Get('all')
  getAllPlaints(@Query() req: Request): Promise<Response<Plaint>> {
    return this.plaintsService.getAllPlaints(req);
  }

  @Post()
  createMyPlaint(
    @MyId() myId: number,
    @Body() dto: CreatePlaintDto,
  ): Promise<void> {
    return this.plaintsService.createPlaint({ ...dto, senderUserId: myId });
  }

  @Roles(Role.JUDGE)
  @Post('all')
  createUserPlaint(@Body() dto: ExtCreatePlaintDto): Promise<void> {
    return this.plaintsService.createPlaint(dto);
  }

  @Post(':plaintId/execute')
  executePlaint(
    @MyId() myId: number,
    @HasRole(Role.JUDGE) hasRole: boolean,
    @Param() { plaintId }: PlaintIdDto,
    @Body() dto: UpdatePlaintDto,
  ): Promise<void> {
    return this.plaintsService.executePlaint({
      ...dto,
      plaintId,
      myId,
      hasRole,
    });
  }

  @Roles(Role.JUDGE)
  @Post(':plaintId')
  completePlaint(
    @MyId() myId: number,
    @HasRole(Role.JUDGE) hasRole: boolean,
    @Param() { plaintId }: PlaintIdDto,
    @Body() dto: UpdatePlaintDto,
  ): Promise<void> {
    return this.plaintsService.completePlaint({
      ...dto,
      plaintId,
      myId,
      hasRole,
    });
  }

  @Delete(':plaintId')
  deletePlaint(
    @MyId() myId: number,
    @HasRole(Role.JUDGE) hasRole: boolean,
    @Param() { plaintId }: PlaintIdDto,
  ): Promise<void> {
    return this.plaintsService.deletePlaint({ plaintId, myId, hasRole });
  }
}
