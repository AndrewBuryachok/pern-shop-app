import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsBargainExists,
  IsCardExists,
  IsDeliveryExists,
  IsSaleExists,
  IsStationExists,
  IsTradeExists,
} from '../../common/constraints';
import { EditStateDto } from '../states/state.dto';
import {
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export class DeliveryIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsDeliveryExists)
  @Type(() => Number)
  deliveryId: number;
}

export class ExtDeliveryIdDto extends DeliveryIdDto {
  myId: number;
  hasRole: boolean;
}

export class EditDeliveryDto extends EditStateDto {}

export class ExtEditDeliveryDto extends EditDeliveryDto {
  deliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class CreateDeliveryDto extends EditDeliveryDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  stationId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export class CreateShopDeliveryDto extends CreateDeliveryDto {
  @ApiProperty()
  @IsId()
  @Validate(IsBargainExists)
  bargainId: number;
}

export class ExtCreateShopDeliveryDto extends CreateShopDeliveryDto {
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

export class CreateStorageDeliveryDto extends CreateDeliveryDto {
  @ApiProperty()
  @IsId()
  @Validate(IsSaleExists)
  saleId: number;
}

export class ExtCreateStorageDeliveryDto extends CreateStorageDeliveryDto {
  myId: number;
  hasRole: boolean;
}

export class TakeDeliveryDto extends TakeTransportationDto {}

export class ExtTakeDeliveryDto extends TakeDeliveryDto {
  deliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class RateDeliveryDto extends RateTransportationDto {}

export class ExtRateDeliveryDto extends RateDeliveryDto {
  deliveryId: number;
  myId: number;
  hasRole: boolean;
}
