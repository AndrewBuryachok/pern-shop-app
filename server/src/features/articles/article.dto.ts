import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsImage, IsText } from '../../common/decorators';
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
  @IsImage()
  image1: string;

  @ApiProperty()
  @IsImage()
  image2: string;

  @ApiProperty()
  @IsImage()
  image3: string;
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
