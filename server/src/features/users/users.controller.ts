import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getMainUsers(): Promise<User[]> {
    return this.usersService.getMainUsers();
  }

  @Get('my')
  getMyUsers(myId: number): Promise<User[]> {
    return this.usersService.getMyUsers(myId);
  }

  @Get('all')
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':userId')
  getSingleUser(userId: number): Promise<User> {
    return this.usersService.getSingleUser(userId);
  }
}
