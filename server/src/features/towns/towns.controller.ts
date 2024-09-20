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
import { TownsService } from './towns.service';
import { Town } from './town.entity';
import { User } from '../users/user.entity';
import {
  CreateTownDto,
  EditTownDto,
  ExtCreateTownDto,
  TownIdDto,
  UpdateTownUserDto,
} from './town.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('towns')
@Controller('towns')
export class TownsController {
  constructor(private townsService: TownsService) {}

  @Public()
  @Get()
  getMainTowns(@Query() req: Request): Promise<Response<Town>> {
    return this.townsService.getMainTowns(req);
  }

  @Get('my')
  getMyTowns(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Town>> {
    return this.townsService.getMyTowns(myId, req);
  }

  @Roles(Role.INSPECTOR)
  @Get('all')
  getAllTowns(@Query() req: Request): Promise<Response<Town>> {
    return this.townsService.getAllTowns(req);
  }

  @Public()
  @Get('all/select')
  selectAllTowns(): Promise<Town[]> {
    return this.townsService.selectAllTowns();
  }

  @Get('my/select')
  selectMyTowns(@MyId() myId: number): Promise<Town[]> {
    return this.townsService.selectMyTowns(myId);
  }

  @Public()
  @Get(':townId/users')
  selectTownUsers(@Param() { townId }: TownIdDto): Promise<User[]> {
    return this.townsService.selectTownUsers(townId);
  }

  @Post()
  createMyTown(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateTownDto,
  ): Promise<void> {
    return this.townsService.createTown({ ...dto, userId: myId, nick });
  }

  @Roles(Role.INSPECTOR)
  @Post('all')
  createUserTown(
    @MyNick() nick: string,
    @Body() dto: ExtCreateTownDto,
  ): Promise<void> {
    return this.townsService.createTown({ ...dto, nick });
  }

  @Patch(':townId')
  editTown(
    @MyId() myId: number,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { townId }: TownIdDto,
    @Body() dto: EditTownDto,
  ): Promise<void> {
    return this.townsService.editTown({ ...dto, townId, myId, hasRole });
  }

  @Post(':townId/users')
  addTownUser(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { townId }: TownIdDto,
    @Body() dto: UpdateTownUserDto,
  ): Promise<void> {
    return this.townsService.addTownUser({
      ...dto,
      townId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':townId/users')
  removeTownUser(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { townId }: TownIdDto,
    @Body() dto: UpdateTownUserDto,
  ): Promise<void> {
    return this.townsService.removeTownUser({
      ...dto,
      townId,
      myId,
      nick,
      hasRole,
    });
  }
}
