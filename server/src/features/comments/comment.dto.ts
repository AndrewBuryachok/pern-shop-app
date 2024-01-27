import { ApiProperty } from '@nestjs/swagger';
import { Validate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsArticleExists, IsCommentExists } from '../../common/constraints';
import { CreateReplyDto } from '../replies/reply.dto';

export class CommentIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCommentExists)
  @Type(() => Number)
  commentId: number;
}

export class EditCommentDto extends CreateReplyDto {}

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

  @ApiProperty()
  @ValidateIf((_, value) => value !== 0)
  @IsId()
  @Validate(IsCommentExists)
  commentId: number;
}

export class ExtCreateCommentDto extends CreateCommentDto {
  myId: number;
}

export class DeleteCommentDto extends CommentIdDto {
  myId: number;
  hasRole: boolean;
}
