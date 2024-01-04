import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsText } from '../../common/decorators';
import { IsDiscussionExists, IsPollExists } from '../../common/constraints';

export class DiscussionIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsDiscussionExists)
  @Type(() => Number)
  discussionId: number;
}

export class EditDiscussionDto {
  @ApiProperty()
  @IsText()
  text: string;
}

export class ExtEditDiscussionDto extends EditDiscussionDto {
  discussionId: number;
  myId: number;
  hasRole: boolean;
}

export class CreateDiscussionDto extends EditDiscussionDto {
  @ApiProperty()
  @IsId()
  @Validate(IsPollExists)
  pollId: number;
}

export class ExtCreateDiscussionDto extends CreateDiscussionDto {
  myId: number;
}

export class DeleteDiscussionDto extends DiscussionIdDto {
  myId: number;
  hasRole: boolean;
}
