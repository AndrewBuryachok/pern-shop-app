import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserCityDto, UpdateUserRolesDto, UserIdDto } from './user.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from './role.enum';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getMainUsers(): Promise<User[]> {
    return this.usersService.getMainUsers();
  }

  @Get('my')
  getMyUsers(@MyId() myId: number): Promise<User[]> {
    return this.usersService.getMyUsers(myId);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('all/select')
  selectAllUsers(): Promise<User[]> {
    return this.usersService.selectAllUsers();
  }

  @Get('free/select')
  selectFreeUsers(): Promise<User[]> {
    return this.usersService.selectFreeUsers();
  }

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
