import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsShopExists, IsUserExists } from '../../common/constraints';
import { CreatePlaceDto, EditPlaceDto } from '../places/place.dto';
import { UserIdDto } from '../users/user.dto';

export class ShopIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsShopExists)
  @Type(() => Number)
  shopId: number;
}

export class CreateShopDto extends CreatePlaceDto {}

export class ExtCreateShopDto extends CreateShopDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class EditShopDto extends EditPlaceDto {}

export class ExtEditShopDto extends EditShopDto {
  shopId: number;
  myId: number;
  hasRole: boolean;
}

export class UpdateShopUserDto extends UserIdDto {}

export class ExtUpdateShopUserDto extends UpdateShopUserDto {
  shopId: number;
  myId: number;
  hasRole: boolean;
}
