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
import { UsersService } from './users.service';
import { User } from './user.entity';
import {
  EditUserPasswordDto,
  EditUserProfileDto,
  UpdateUserRoleDto,
  UserIdDto,
  UserNickDto,
} from './user.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
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

  @Public()
  @Get('top')
  getTopUsers(@Query() req: Request): Promise<Response<User>> {
    return this.usersService.getTopUsers(req);
  }

  @Public()
  @Get('friends')
  getFriendsUsers(@Query() req: Request): Promise<Response<User>> {
    return this.usersService.getFriendsUsers(req);
  }

  @Public()
  @Get('subscribers')
  getSubscribersUsers(@Query() req: Request): Promise<Response<User>> {
    return this.usersService.getSubscribersUsers(req);
  }

  @Public()
  @Get('ratings')
  getRatingsUsers(@Query() req: Request): Promise<Response<User>> {
    return this.usersService.getRatingsUsers(req);
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

  @Get('not-subscribed/select')
  selectNotSubscribedUsers(@MyId() myId: number): Promise<User[]> {
    return this.usersService.selectNotSubscribedUsers(myId);
  }

  @Get('not-rated/select')
  selectNotRatedUsers(@MyId() myId: number): Promise<User[]> {
    return this.usersService.selectNotRatedUsers(myId);
  }

  @Public()
  @Get(':nick')
  getSingleUser(@Param() { nick }: UserNickDto): Promise<User> {
    return this.usersService.getSingleUser(nick);
  }

  @Patch(':userId/profile')
  editUserProfile(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { userId }: UserIdDto,
    @Body() dto: EditUserProfileDto,
  ): Promise<void> {
    return this.usersService.editUserProfile({ ...dto, userId, myId, hasRole });
  }

  @Roles(Role.ADMIN)
  @Patch(':userId/password')
  editUserPassword(
    @Param() { userId }: UserIdDto,
    @Body() dto: EditUserPasswordDto,
  ): Promise<void> {
    return this.usersService.editUserPassword({ ...dto, userId });
  }

  @Roles(Role.ADMIN)
  @Post(':userId/roles')
  addUserRole(
    @Param() { userId }: UserIdDto,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<void> {
    return this.usersService.addUserRole({ ...dto, userId });
  }

  @Roles(Role.ADMIN)
  @Delete(':userId/roles')
  removeUserRole(
    @Param() { userId }: UserIdDto,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<void> {
    return this.usersService.removeUserRole({ ...dto, userId });
  }
}
