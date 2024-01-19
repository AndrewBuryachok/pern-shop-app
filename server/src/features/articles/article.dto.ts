import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsLink, IsText } from '../../common/decorators';
import { IsArticleExists, IsUserExists } from '../../common/constraints';

export class ArticleIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsArticleExists)
  @Type(() => Number)
  articleId: number;
}

export class CreateArticleDto {
  @ApiProperty()
  @IsText()
  text: string;

  @ApiProperty()
  @IsLink()
  image1: string;

  @ApiProperty()
  @IsLink()
  image2: string;

  @ApiProperty()
  @IsLink()
  image3: string;

  @ApiProperty()
  @IsLink()
  video: string;
}

export class ExtCreateArticleDto extends CreateArticleDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class EditArticleDto extends CreateArticleDto {}

export class ExtEditArticleDto extends CreateArticleDto {
  articleId: number;
  myId: number;
  hasRole: boolean;
}

export class DeleteArticleDto extends ArticleIdDto {
  myId: number;
  hasRole: boolean;
}

export class LikeArticleDto extends ArticleIdDto {
  myId: number;
}
