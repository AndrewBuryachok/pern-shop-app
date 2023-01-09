import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsPrice } from '../../common/decorators';
import { IsCardExists, IsMarketExists } from '../../common/constraints';
import { CreatePlaceDto } from '../places/place.dto';

export class MarketIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsMarketExists)
  @Type(() => Number)
  marketId: number;
}

export class CreateMarketDto extends CreatePlaceDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;

  @ApiProperty()
  @IsPrice()
  price: number;
}

export class ExtCreateMarketDto extends CreateMarketDto {
  myId: number;
}

export class EditMarketDto extends CreatePlaceDto {}

export class ExtEditMarketDto extends EditMarketDto {
  marketId: number;
  myId: number;
}
