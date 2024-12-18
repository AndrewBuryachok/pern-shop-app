import {
  CreateDeliveryDto,
  EditDeliveryDto,
  RateDeliveryDto,
  TakeDeliveryDto,
} from '../deliveries/delivery.dto';

export interface CreateMarketDeliveryDto extends CreateDeliveryDto {
  tradeId: number;
}

export interface EditMarketDeliveryDto extends EditDeliveryDto {
  marketDeliveryId: number;
}

export interface TakeMarketDeliveryDto extends TakeDeliveryDto {
  marketDeliveryId: number;
}

export interface MarketDeliveryIdDto {
  marketDeliveryId: number;
}

export interface RateMarketDeliveryDto extends RateDeliveryDto {
  marketDeliveryId: number;
}
