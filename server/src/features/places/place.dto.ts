import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import {
  IsCoordinate,
  IsDescription,
  IsId,
  IsLink,
  IsName,
  IsPrice,
} from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';

export abstract class CreatePlaceDto {
  @ApiProperty()
  @IsName()
  name: string;

  @ApiProperty()
  @IsLink()
  image: string;

  @ApiProperty()
  @IsLink()
  video: string;

  @ApiProperty()
  @IsDescription()
  description: string;

  @ApiProperty()
  @IsCoordinate()
  x: number;

  @ApiProperty()
  @IsCoordinate()
  y: number;
}

export abstract class CreatePlaceWithCardDto extends CreatePlaceDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;

  @ApiProperty()
  @IsPrice()
  price: number;
}

export abstract class EditPlaceDto extends CreatePlaceDto {}

export abstract class EditPlaceWithPriceDto extends CreatePlaceDto {
  @ApiProperty()
  @IsPrice()
  price: number;
}
