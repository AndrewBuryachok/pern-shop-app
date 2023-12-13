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
import { CreatePlaintDto, PlaintIdDto, UpdatePlaintDto } from './plaint.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
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
  createPlaint(
    @MyId() myId: number,
    @Body() dto: CreatePlaintDto,
  ): Promise<void> {
    return this.plaintsService.createPlaint({ ...dto, myId });
  }

  @Post(':plaintId/execute')
  executePlaint(
    @MyId() myId: number,
    @Param() { plaintId }: PlaintIdDto,
    @Body() dto: UpdatePlaintDto,
  ): Promise<void> {
    return this.plaintsService.executePlaint({ ...dto, plaintId, myId });
  }

  @Roles(Role.JUDGE)
  @Post(':plaintId')
  completePlaint(
    @MyId() myId: number,
    @Param() { plaintId }: PlaintIdDto,
    @Body() dto: UpdatePlaintDto,
  ): Promise<void> {
    return this.plaintsService.completePlaint({ ...dto, plaintId, myId });
  }

  @Delete(':plaintId')
  deletePlaint(
    @MyId() myId: number,
    @Param() { plaintId }: PlaintIdDto,
  ): Promise<void> {
    return this.plaintsService.deletePlaint({ plaintId, myId });
  }
}
