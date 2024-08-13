import { CreateServiceDto, EditServiceDto } from '../services/service.dto';
import {
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export interface CreateTaskDto extends CreateServiceDto {}

export interface EditTaskDto extends EditServiceDto {
  taskId: number;
}

export interface TakeTaskDto extends TakeTransportationDto {
  taskId: number;
}

export interface TaskIdDto {
  taskId: number;
}

export interface RateTaskDto extends RateTransportationDto {
  taskId: number;
}
