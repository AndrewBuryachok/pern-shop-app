import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsGoodExists, IsShopExists } from '../../common/constraints';
import { CreateThingDto } from '../things/thing.dto';

export class GoodIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsGoodExists)
  @Type(() => Number)
  goodId: number;
}

export class CreateGoodDto extends CreateThingDto {
  @ApiProperty()
  @IsId()
  @Validate(IsShopExists)
  shopId: number;
}

export class ExtCreateGoodDto extends CreateGoodDto {
  myId: number;
}

export class DeleteGoodDto extends GoodIdDto {
  myId: number;
}
