import { CreateThingDto } from '../things/thing.dto';

export interface CreateTaskDto extends CreateThingDto {}

export interface ExtCreateTaskDto extends CreateTaskDto {
  userId: number;
}

export interface EditTaskDto extends CreateThingDto {
  taskId: number;
}

export interface TaskIdDto {
  taskId: number;
}

export interface TakeTaskDto extends TaskIdDto {
  userId: number;
}
