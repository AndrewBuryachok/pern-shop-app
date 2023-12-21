import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsText, IsTitle, IsType } from '../../common/decorators';
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
  @IsTitle()
  title: string;

  @ApiProperty()
  @IsText()
  text: string;
}

export class ExtCreatePollDto extends CreatePollDto {
  myId: number;
}

export class ExtPollIdDto extends PollIdDto {
  myId: number;
  hasRole: boolean;
}

export class VotePollDto {
  @ApiProperty()
  @IsType()
  type: boolean;
}

export class ExtVotePollDto extends VotePollDto {
  pollId: number;
  myId: number;
}
