import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsImages, IsMark, IsText } from '../../common/decorators';
import { IsPollExists, IsUserExists } from '../../common/constraints';
import { CreateReactionDto } from '../reactions/reaction.dto';

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
  @IsImages()
  images: string[];
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

export class CompletePollDto extends CreateReactionDto {}

export class ExtCompletePollDto extends CompletePollDto {
  pollId: number;
  myId: number;
}

export class DeletePollDto extends PollIdDto {
  myId: number;
  hasRole: boolean;
}

export class ViewPollDto {
  pollId: number;
  myId: number;
}

export class LikePollDto extends CreateReactionDto {}

export class ExtLikePollDto extends LikePollDto {
  pollId: number;
  myId: number;
}
