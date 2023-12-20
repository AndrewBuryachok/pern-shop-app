export interface CreateTaskDto {
  title: string;
  text: string;
  priority: number;
}

export interface TaskIdDto {
  taskId: number;
}
