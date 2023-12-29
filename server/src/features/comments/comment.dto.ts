import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsText } from '../../common/decorators';
import { IsArticleExists, IsCommentExists } from '../../common/constraints';

export class CommentIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCommentExists)
  @Type(() => Number)
  commentId: number;
}

export class EditCommentDto {
  @ApiProperty()
  @IsText()
  text: string;
}

export class ExtEditCommentDto extends EditCommentDto {
  commentId: number;
  myId: number;
  hasRole: boolean;
}

export class CreateCommentDto extends EditCommentDto {
  @ApiProperty()
  @IsId()
  @Validate(IsArticleExists)
  articleId: number;
}

export class ExtCreateCommentDto extends CreateCommentDto {
  myId: number;
}

export class DeleteCommentDto extends CommentIdDto {
  myId: number;
  hasRole: boolean;
}
