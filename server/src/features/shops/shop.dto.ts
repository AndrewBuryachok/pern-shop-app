import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsShopExists } from '../../common/constraints';
import { CreatePlaceDto, CreatePlaceWithCardDto } from '../places/place.dto';

export class ShopIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsShopExists)
  @Type(() => Number)
  shopId: number;
}

export class CreateShopDto extends CreatePlaceWithCardDto {}

export class ExtCreateShopDto extends CreateShopDto {
  myId: number;
  hasRole: boolean;
}

export class EditShopDto extends CreatePlaceDto {}

export class ExtEditShopDto extends EditShopDto {
  shopId: number;
  myId: number;
  hasRole: boolean;
}
