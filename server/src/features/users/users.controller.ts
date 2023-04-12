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
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserCityDto, UpdateUserRolesDto, UserIdDto } from './user.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
import { Role } from './role.enum';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  getMainUsers(@Query() req: Request): Promise<Response<User>> {
    return this.usersService.getMainUsers(req);
  }

  @Get('my')
  getMyUsers(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.usersService.getMyUsers(myId, req);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllUsers(@Query() req: Request): Promise<Response<User>> {
    return this.usersService.getAllUsers(req);
  }

  @Public()
  @Get('all/select')
  selectAllUsers(): Promise<User[]> {
    return this.usersService.selectAllUsers();
  }

  @Public()
  @Get('not-citizens/select')
  selectNotCitizensUsers(): Promise<User[]> {
    return this.usersService.selectNotCitizensUsers();
  }

  @Get('not-friends/select')
  selectNotFriendsUsers(@MyId() myId: number): Promise<User[]> {
    return this.usersService.selectNotFriendsUsers(myId);
  }

  @Public()
  @Get(':userId')
  getSingleUser(@Param() { userId }: UserIdDto): Promise<User> {
    return this.usersService.getSingleUser(userId);
  }

  @Roles(Role.ADMIN)
  @Post(':userId/roles')
  addUserRole(
    @Param() { userId }: UserIdDto,
    @Body() dto: UpdateUserRolesDto,
  ): Promise<void> {
    return this.usersService.addUserRole({ ...dto, userId });
  }

  @Roles(Role.ADMIN)
  @Delete(':userId/roles')
  removeUserRole(
    @Param() { userId }: UserIdDto,
    @Body() dto: UpdateUserRolesDto,
  ): Promise<void> {
    return this.usersService.removeUserRole({ ...dto, userId });
  }

  @Post(':userId/city')
  addUserCity(
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
    @Body() dto: UpdateUserCityDto,
  ): Promise<void> {
    return this.usersService.addUserCity({ ...dto, userId, myId });
  }

  @Delete(':userId/city')
  removeUserCity(
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
    @Body() dto: UpdateUserCityDto,
  ): Promise<void> {
    return this.usersService.removeUserCity({ ...dto, userId, myId });
  }
}
