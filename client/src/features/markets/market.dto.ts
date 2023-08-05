import {
  CreatePlaceWithCardDto,
  CreatePlaceWithPriceDto,
} from '../places/place.dto';

export interface CreateMarketDto extends CreatePlaceWithCardDto {}

export interface EditMarketDto extends CreatePlaceWithPriceDto {
  marketId: number;
}
