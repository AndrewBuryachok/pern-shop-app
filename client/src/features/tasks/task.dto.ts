export interface CreateTaskDto {
  title: string;
  text: string;
  priority: number;
}

export interface ExtCreateTaskDto extends CreateTaskDto {
  userId: number;
}

export interface TaskIdDto {
  taskId: number;
}

export interface TakeTaskDto extends TaskIdDto {
  userId: number;
}
