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
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto, ExtCreateTaskDto, TaskIdDto } from './task.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
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

  @Roles(Role.ADMIN)
  @Get('all')
  getAllTasks(@Query() req: Request): Promise<Response<Task>> {
    return this.tasksService.getAllTasks(req);
  }

  @Post()
  createMyTask(
    @MyId() myId: number,
    @Body() dto: CreateTaskDto,
  ): Promise<void> {
    return this.tasksService.createTask({ ...dto, userId: myId });
  }

  @Roles(Role.ADMIN)
  @Post('all')
  createUserTask(@Body() dto: ExtCreateTaskDto): Promise<void> {
    return this.tasksService.createTask(dto);
  }

  @Post(':taskId/take')
  takeTask(
    @MyId() myId: number,
    @Param() { taskId }: TaskIdDto,
  ): Promise<void> {
    return this.tasksService.takeTask({ taskId, myId });
  }

  @Delete(':taskId/take')
  untakeTask(
    @MyId() myId: number,
    @Param() { taskId }: TaskIdDto,
  ): Promise<void> {
    return this.tasksService.untakeTask({ taskId, myId });
  }

  @Post(':taskId/execute')
  executeTask(
    @MyId() myId: number,
    @Param() { taskId }: TaskIdDto,
  ): Promise<void> {
    return this.tasksService.executeTask({ taskId, myId });
  }

  @Post(':taskId')
  completeTask(
    @MyId() myId: number,
    @Param() { taskId }: TaskIdDto,
  ): Promise<void> {
    return this.tasksService.completeTask({ taskId, myId });
  }

  @Delete(':taskId')
  deleteTask(
    @MyId() myId: number,
    @Param() { taskId }: TaskIdDto,
  ): Promise<void> {
    return this.tasksService.deleteTask({ taskId, myId });
  }
}
