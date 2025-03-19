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
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import {
  CreateTaskDto,
  EditTaskDto,
  TaskIdDto,
  TakeTaskDto,
  CompleteTaskDto,
} from './task.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Public()
  @Get()
  getMainTasks(@Query() req: Request): Promise<Response<Task>> {
    return this.tasksService.getMainTasks(req);
  }

  @Get('my')
  getMyTasks(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Task>> {
    return this.tasksService.getMyTasks(myId, req);
  }

  @Get('taken')
  getTakenTasks(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Task>> {
    return this.tasksService.getTakenTasks(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllTasks(@Query() req: Request): Promise<Response<Task>> {
    return this.tasksService.getAllTasks(req);
  }

  @Post()
  createTask(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateTaskDto,
  ): Promise<void> {
    return this.tasksService.createTask({ ...dto, myId, nick, hasRole });
  }

  @Patch(':taskId')
  editTask(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { taskId }: TaskIdDto,
    @Body() dto: EditTaskDto,
  ): Promise<void> {
    return this.tasksService.editTask({
      ...dto,
      taskId,
      myId,
      hasRole,
    });
  }

  @Post(':taskId/take')
  takeTask(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { taskId }: TaskIdDto,
    @Body() dto: TakeTaskDto,
  ): Promise<void> {
    return this.tasksService.takeTask({
      ...dto,
      taskId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':taskId/take')
  untakeTask(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { taskId }: TaskIdDto,
  ): Promise<void> {
    return this.tasksService.untakeTask({ taskId, myId, nick, hasRole });
  }

  @Post(':taskId/execute')
  executeTask(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { taskId }: TaskIdDto,
  ): Promise<void> {
    return this.tasksService.executeTask({ taskId, myId, nick, hasRole });
  }

  @Post(':taskId')
  completeTask(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { taskId }: TaskIdDto,
    @Body() dto: CompleteTaskDto,
  ): Promise<void> {
    return this.tasksService.completeTask({
      ...dto,
      taskId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':taskId')
  deleteTask(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { taskId }: TaskIdDto,
  ): Promise<void> {
    return this.tasksService.deleteTask({ taskId, myId, nick, hasRole });
  }
}
