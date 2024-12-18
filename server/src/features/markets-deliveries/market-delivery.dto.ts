import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsMarketDeliveryExists,
  IsTradeExists,
} from '../../common/constraints';
import {
  CreateDeliveryDto,
  EditDeliveryDto,
  RateDeliveryDto,
  TakeDeliveryDto,
} from '../deliveries/delivery.dto';

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

export class CreateMarketDeliveryDto extends CreateDeliveryDto {
  @ApiProperty()
  @IsId()
  @Validate(IsTradeExists)
  tradeId: number;
}

export class ExtCreateMarketDeliveryDto extends CreateMarketDeliveryDto {
  myId: number;
  hasRole: boolean;
}

export class EditMarketDeliveryDto extends EditDeliveryDto {}

export class ExtEditMarketDeliveryDto extends EditMarketDeliveryDto {
  marketDeliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class TakeMarketDeliveryDto extends TakeDeliveryDto {}

export class ExtTakeMarketDeliveryDto extends TakeMarketDeliveryDto {
  marketDeliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class RateMarketDeliveryDto extends RateDeliveryDto {}

export class ExtRateMarketDeliveryDto extends RateMarketDeliveryDto {
  marketDeliveryId: number;
  myId: number;
  hasRole: boolean;
}
