import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsMarketExists } from '../../common/constraints';
import {
  CreatePlaceWithCardDto,
  EditPlaceWithPriceDto,
} from '../places/place.dto';

export class MarketIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsMarketExists)
  @Type(() => Number)
  marketId: number;
}

export class CreateMarketDto extends CreatePlaceWithCardDto {}

export class ExtCreateMarketDto extends CreateMarketDto {
  myId: number;
  hasRole: boolean;
}

export class EditMarketDto extends EditPlaceWithPriceDto {}

export class ExtEditMarketDto extends EditMarketDto {
  marketId: number;
  myId: number;
  hasRole: boolean;
}
