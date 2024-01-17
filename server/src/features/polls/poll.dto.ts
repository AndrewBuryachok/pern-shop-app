import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsId,
  IsResult,
  IsText,
  IsTitle,
  IsType,
} from '../../common/decorators';
import { IsPollExists, IsUserExists } from '../../common/constraints';

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
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class CompletePollDto {
  @ApiProperty()
  @IsResult()
  result: number;
}

export class ExtCompletePollDto extends CompletePollDto {
  pollId: number;
}

export class DeletePollDto extends PollIdDto {
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
