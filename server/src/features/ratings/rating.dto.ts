import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsRate } from '../../common/decorators';
import { IsRatingExists, IsUserExists } from '../../common/constraints';

export class RatingIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsRatingExists)
  @Type(() => Number)
  ratingId: number;
}

export class EditRatingDto {
  @ApiProperty()
  @IsRate()
  rate: number;
}

export class ExtEditRatingDto extends EditRatingDto {
  ratingId: number;
  myId: number;
}

export class CreateRatingDto extends EditRatingDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class ExtCreateRatingDto extends CreateRatingDto {
  myId: number;
}

export class DeleteRatingDto extends RatingIdDto {
  myId: number;
}
