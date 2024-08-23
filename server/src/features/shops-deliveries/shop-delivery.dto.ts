import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsShopDeliveryExists,
  IsBargainExists,
} from '../../common/constraints';
import {
  CreateHaulageDto,
  EditHaulageDto,
  RateHaulageDto,
  TakeHaulageDto,
} from '../haulages/haulage.dto';

export class ShopDeliveryIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsShopDeliveryExists)
  @Type(() => Number)
  shopDeliveryId: number;
}

export class ExtShopDeliveryIdDto extends ShopDeliveryIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateShopDeliveryDto extends CreateHaulageDto {
  @ApiProperty()
  @IsId()
  @Validate(IsBargainExists)
  bargainId: number;
}

export class ExtCreateShopDeliveryDto extends CreateShopDeliveryDto {
  myId: number;
  hasRole: boolean;
}

export class EditShopDeliveryDto extends EditHaulageDto {}

export class ExtEditShopDeliveryDto extends EditShopDeliveryDto {
  shopDeliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class TakeShopDeliveryDto extends TakeHaulageDto {}

export class ExtTakeShopDeliveryDto extends TakeShopDeliveryDto {
  shopDeliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class RateShopDeliveryDto extends RateHaulageDto {}

export class ExtRateShopDeliveryDto extends RateShopDeliveryDto {
  shopDeliveryId: number;
  myId: number;
  hasRole: boolean;
}
