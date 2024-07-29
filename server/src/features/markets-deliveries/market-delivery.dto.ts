import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsMarketDeliveryExists,
  IsTradeExists,
} from '../../common/constraints';
import {
  CreateHaulageDto,
  EditHaulageDto,
  RateHaulageDto,
  TakeHaulageDto,
} from '../haulages/haulage.dto';

export class MarketDeliveryIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsMarketDeliveryExists)
  @Type(() => Number)
  marketDeliveryId: number;
}

export class ExtMarketDeliveryIdDto extends MarketDeliveryIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateMarketDeliveryDto extends CreateHaulageDto {
  @ApiProperty()
  @IsId()
  @Validate(IsTradeExists)
  tradeId: number;
}

export class ExtCreateMarketDeliveryDto extends CreateMarketDeliveryDto {
  myId: number;
  hasRole: boolean;
}

export class EditMarketDeliveryDto extends EditHaulageDto {}

export class ExtEditMarketDeliveryDto extends EditMarketDeliveryDto {
  marketDeliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class TakeMarketDeliveryDto extends TakeHaulageDto {}

export class ExtTakeMarketDeliveryDto extends TakeMarketDeliveryDto {
  marketDeliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class RateMarketDeliveryDto extends RateHaulageDto {}

export class ExtRateMarketDeliveryDto extends RateMarketDeliveryDto {
  marketDeliveryId: number;
  myId: number;
  hasRole: boolean;
}
