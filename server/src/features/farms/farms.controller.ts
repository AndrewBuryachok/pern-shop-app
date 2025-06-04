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
import { FarmsService } from './farms.service';
import { Farm } from './farm.entity';
import { User } from '../users/user.entity';
import {
  CreateFarmDto,
  EditFarmDto,
  ExtCreateFarmDto,
  FarmIdDto,
  UpdateFarmUserDto,
} from './farm.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('farms')
@Controller('farms')
export class FarmsController {
  constructor(private farmsService: FarmsService) {}

  @Public()
  @Get()
  getMainFarms(@Query() req: Request): Promise<Response<Farm>> {
    return this.farmsService.getMainFarms(req);
  }

  @Get('my')
  getMyFarms(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Farm>> {
    return this.farmsService.getMyFarms(myId, req);
  }

  @Roles(Role.INSPECTOR)
  @Get('all')
  getAllFarms(@Query() req: Request): Promise<Response<Farm>> {
    return this.farmsService.getAllFarms(req);
  }

  @Public()
  @Get('all/select')
  selectAllFarms(): Promise<Farm[]> {
    return this.farmsService.selectAllFarms();
  }

  @Public()
  @Get(':farmId/users')
  selectFarmUsers(@Param() { farmId }: FarmIdDto): Promise<User[]> {
    return this.farmsService.selectFarmUsers(farmId);
  }

  @Post()
  createMyFarm(
    @MyId() myId: number,
    @Body() dto: CreateFarmDto,
  ): Promise<void> {
    return this.farmsService.createFarm({ ...dto, userId: myId });
  }

  @Roles(Role.INSPECTOR)
  @Post('all')
  createUserFarm(@Body() dto: ExtCreateFarmDto): Promise<void> {
    return this.farmsService.createFarm(dto);
  }

  @Patch(':farmId')
  editFarm(
    @MyId() myId: number,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { farmId }: FarmIdDto,
    @Body() dto: EditFarmDto,
  ): Promise<void> {
    return this.farmsService.editFarm({ ...dto, farmId, myId, hasRole });
  }

  @Post(':farmId/users')
  addFarmUser(
    @MyId() myId: number,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { farmId }: FarmIdDto,
    @Body() dto: UpdateFarmUserDto,
  ): Promise<void> {
    return this.farmsService.addFarmUser({ ...dto, farmId, myId, hasRole });
  }

  @Delete(':farmId/users')
  removeFarmUser(
    @MyId() myId: number,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { farmId }: FarmIdDto,
    @Body() dto: UpdateFarmUserDto,
  ): Promise<void> {
    return this.farmsService.removeFarmUser({ ...dto, farmId, myId, hasRole });
  }
}
