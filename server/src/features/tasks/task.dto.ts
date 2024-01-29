import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsTaskExists, IsUserExists } from '../../common/constraints';
import { CreateThingDto } from '../things/thing.dto';

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

export class CreateTaskDto extends CreateThingDto {}

export class ExtCreateTaskDto extends CreateTaskDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class EditTaskDto extends CreateThingDto {}

export class ExtEditTaskDto extends EditTaskDto {
  taskId: number;
  myId: number;
  hasRole: boolean;
}

export class TakeTaskDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class ExtTakeTaskDto extends TakeTaskDto {
  taskId: number;
}
