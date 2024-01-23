import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsPriority, IsText, IsTitle } from '../../common/decorators';
import { IsTaskExists, IsUserExists } from '../../common/constraints';

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

export class CreateTaskDto {
  @ApiProperty()
  @IsTitle()
  title: string;

  @ApiProperty()
  @IsText()
  text: string;

  @ApiProperty()
  @IsPriority()
  priority: number;
}

export class ExtCreateTaskDto extends CreateTaskDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
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
