import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsId,
  IsPriority,
  IsRequiredDescription,
} from '../../common/decorators';
import { IsTaskExists } from '../../common/constraints';

export class TaskIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsTaskExists)
  @Type(() => Number)
  taskId: number;
}

export class CreateTaskDto {
  @ApiProperty()
  @IsRequiredDescription()
  description: string;

  @ApiProperty()
  @IsPriority()
  priority: number;
}

export class ExtCreateTaskDto extends CreateTaskDto {
  myId: number;
  cityId?: number;
}

export class ExtTaskIdDto extends TaskIdDto {
  myId: number;
}
