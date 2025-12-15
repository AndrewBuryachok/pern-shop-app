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
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from './role.enum';

@ApiTags(':project/users')
@Controller(':project/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  getMainUsers(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.usersService.getMainUsers(project, req);
  }

  @Public()
  @Get('top')
  getTopUsers(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.usersService.getTopUsers(project, req);
  }

  @Get('my')
  getMyUsers(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.usersService.getMyUsers(project, myId, req);
  }

  @Roles(Role.MODER)
  @Get('banned')
  getBannedUsers(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.usersService.getBannedUsers(project, req);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllUsers(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.usersService.getAllUsers(project, req);
  }

  @Public()
  @Get('all/select')
  selectAllUsers(@Param() { project }: ProjectDto): Promise<User[]> {
    return this.usersService.selectAllUsers(project);
  }

  @Roles(Role.MODER)
  @Get('not-banned/select')
  selectNotBannedUsers(@Param() { project }: ProjectDto): Promise<User[]> {
    return this.usersService.selectNotBannedUsers(project);
  }

  @Public()
  @Get('not-citizens/select')
  selectNotCitizensUsers(@Param() { project }: ProjectDto): Promise<User[]> {
    return this.usersService.selectNotCitizensUsers(project);
  }

  @Get('not-friends/select')
  selectNotFriendsUsers(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
  ): Promise<User[]> {
    return this.usersService.selectNotFriendsUsers(project, myId);
  }

  @Public()
  @Get(':nick')
  getSingleUser(
    @Param() { project }: ProjectDto,
    @Param() { nick }: UserNickDto,
  ): Promise<User> {
    return this.usersService.getSingleUser(project, nick);
  }

  @Patch(':userId/profile')
  editUserProfile(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { userId }: UserIdDto,
    @Body() dto: EditUserProfileDto,
  ): Promise<void> {
    return this.usersService.editUserProfile(project, {
      ...dto,
      userId,
      myId,
      hasRole,
    });
  }

  @Roles(Role.ADMIN)
  @Patch(':userId/password')
  editUserPassword(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Body() dto: EditUserPasswordDto,
  ): Promise<void> {
    return this.usersService.editUserPassword(project, { ...dto, userId });
  }

  @Roles(Role.MODER)
  @Post(':userId/banned')
  addUserBanned(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.usersService.addUserBanned(project, { userId });
  }

  @Roles(Role.MODER)
  @Delete(':userId/banned')
  removeUserBanned(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.usersService.removeUserBanned(project, { userId });
  }

  @Roles(Role.ADMIN)
  @Post(':userId/roles')
  addUserRole(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<void> {
    return this.usersService.addUserRole(project, { ...dto, userId });
  }

  @Roles(Role.ADMIN)
  @Delete(':userId/roles')
  removeUserRole(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<void> {
    return this.usersService.removeUserRole(project, { ...dto, userId });
  }
}
