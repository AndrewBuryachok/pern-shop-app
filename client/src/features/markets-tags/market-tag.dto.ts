import { CreateTagDto } from '../tags/tag.dto';

export interface CreateMarketTagDto extends CreateTagDto {
  marketId: number;
}

export interface EditMarketTagDto extends CreateTagDto {
  marketTagId: number;
}
