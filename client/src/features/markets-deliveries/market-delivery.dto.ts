import {
  CreateHaulageDto,
  RateHaulageDto,
  TakeHaulageDto,
} from '../haulages/haulage.dto';

export interface CreateMarketDeliveryDto extends CreateHaulageDto {
  tradeId: number;
}

export interface TakeMarketDeliveryDto extends TakeHaulageDto {
  marketDeliveryId: number;
}

export interface MarketDeliveryIdDto {
  marketDeliveryId: number;
}

export interface RateMarketDeliveryDto extends RateHaulageDto {
  marketDeliveryId: number;
}
