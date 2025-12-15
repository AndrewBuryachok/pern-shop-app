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
} from './town.dto';
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/towns')
@Controller(':project/towns')
export class TownsController {
  constructor(private townsService: TownsService) {}

  @Public()
  @Get()
  getMainTowns(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Town>> {
    return this.townsService.getMainTowns(project, req);
  }

  @Get('my')
  getMyTowns(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Town>> {
    return this.townsService.getMyTowns(project, myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllTowns(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Town>> {
    return this.townsService.getAllTowns(project, req);
  }

  @Public()
  @Get('all/select')
  selectAllTowns(@Param() { project }: ProjectDto): Promise<Town[]> {
    return this.townsService.selectAllTowns(project);
  }

  @Get('my/select')
  selectMyTowns(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
  ): Promise<Town[]> {
    return this.townsService.selectMyTowns(project, myId);
  }

  @Public()
  @Get(':townId/users')
  selectTownUsers(
    @Param() { project }: ProjectDto,
    @Param() { townId }: TownIdDto,
  ): Promise<User[]> {
    return this.townsService.selectTownUsers(project, townId);
  }

  @Post()
  createMyTown(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Body() dto: CreateTownDto,
  ): Promise<void> {
    return this.townsService.createTown(project, { ...dto, userId: myId });
  }

  @Roles(Role.MODER)
  @Post('all')
  createUserTown(
    @Param() { project }: ProjectDto,
    @Body() dto: ExtCreateTownDto,
  ): Promise<void> {
    return this.townsService.createTown(project, dto);
  }

  @Patch(':townId')
  editTown(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { townId }: TownIdDto,
    @Body() dto: EditTownDto,
  ): Promise<void> {
    return this.townsService.editTown(project, {
      ...dto,
      townId,
      myId,
      hasRole,
    });
  }

  @Delete(':townId')
  deleteTown(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { townId }: TownIdDto,
  ): Promise<void> {
    return this.townsService.deleteTown(project, { townId, myId, hasRole });
  }
}
