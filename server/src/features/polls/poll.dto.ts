import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsRequiredDescription } from '../../common/decorators';
import { IsPollExists } from '../../common/constraints';

export class PollIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsPollExists)
  @Type(() => Number)
  pollId: number;
}

export class CreatePollDto {
  @ApiProperty()
  @IsRequiredDescription()
  description: string;
}

export class ExtCreatePollDto extends CreatePollDto {
  myId: number;
}

export class CompletePollDto extends PollIdDto {
  myId: number;
  hasRole: boolean;
}

export class DeletePollDto extends PollIdDto {
  myId: number;
  hasRole: boolean;
}
