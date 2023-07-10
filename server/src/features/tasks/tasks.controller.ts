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
import { CreateTaskDto, TaskIdDto } from './task.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getMainTasks(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Task>> {
    return this.tasksService.getMainTasks(myId, req);
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

  @Get('placed')
  getPlacedTasks(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Task>> {
    return this.tasksService.getPlacedTasks(myId, req);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllTasks(@Query() req: Request): Promise<Response<Task>> {
    return this.tasksService.getAllTasks(req);
  }

  @Post()
  createTask(@MyId() myId: number, @Body() dto: CreateTaskDto): Promise<void> {
    return this.tasksService.createTask({ ...dto, myId });
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
