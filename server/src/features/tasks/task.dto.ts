import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsTaskExists } from '../../common/constraints';
import { CreateServiceDto, EditServiceDto } from '../services/service.dto';
import {
  CompleteTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export class TaskIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsTaskExists)
  @Type(() => Number)
  taskId: number;
}

export class ExtTaskIdDto extends TaskIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateTaskDto extends CreateServiceDto {}

export class ExtCreateTaskDto extends CreateTaskDto {
  myId: number;
  hasRole: boolean;
}

export class EditTaskDto extends EditServiceDto {}

export class ExtEditTaskDto extends EditTaskDto {
  taskId: number;
  myId: number;
  hasRole: boolean;
}

export class TakeTaskDto extends TakeTransportationDto {}

export class ExtTakeTaskDto extends TakeTaskDto {
  taskId: number;
  myId: number;
  hasRole: boolean;
}

export class CompleteTaskDto extends CompleteTransportationDto {}

export class ExtCompleteTaskDto extends CompleteTaskDto {
  taskId: number;
  myId: number;
  hasRole: boolean;
}
