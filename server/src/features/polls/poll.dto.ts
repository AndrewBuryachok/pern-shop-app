import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsLink, IsMark, IsText, IsType } from '../../common/decorators';
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
  @IsText()
  text: string;

  @ApiProperty()
  @IsMark()
  mark: number;

  @ApiProperty()
  @IsLink()
  image: string;

  @ApiProperty()
  @IsLink()
  video: string;
}

export class ExtCreatePollDto extends CreatePollDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class EditPollDto extends CreatePollDto {}

export class ExtEditPollDto extends EditPollDto {
  pollId: number;
  myId: number;
  hasRole: boolean;
}

export class CompletePollDto {
  @ApiProperty()
  @IsType()
  type: number;
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
