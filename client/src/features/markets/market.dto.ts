import { CreatePlaceDto, CreatePlaceWithCardDto } from '../places/place.dto';

export interface CreateMarketDto extends CreatePlaceWithCardDto {}

export interface EditMarketDto extends CreatePlaceDto {
  marketId: number;
}
