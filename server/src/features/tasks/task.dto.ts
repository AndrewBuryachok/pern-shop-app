import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDescription, IsId, IsPriority } from '../../common/decorators';
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
  @IsDescription()
  description: string;

  @ApiProperty()
  @IsPriority()
  priority: number;
}

export class ExtCreateTaskDto extends CreateTaskDto {
  myId: number;
}

export class ExtTaskIdDto extends TaskIdDto {
  myId: number;
}
