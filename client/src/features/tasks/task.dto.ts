export interface CreateTaskDto {
  description: string;
  priority: number;
}

export interface TakeTaskDto {
  taskId: number;
}

export interface TaskIdDto {
  taskId: number;
}
