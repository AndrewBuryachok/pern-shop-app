import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsBargainExists, IsGoodExists } from '../../common/constraints';
import { CreatePurchaseDto, RatePurchaseDto } from '../purchases/purchase.dto';

export class BargainIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsBargainExists)
  @Type(() => Number)
  bargainId: number;
}

export class CreateBargainDto extends CreatePurchaseDto {
  @ApiProperty()
  @IsId()
  @Validate(IsGoodExists)
  goodId: number;
}

export class ExtCreateBargainDto extends CreateBargainDto {
  myId: number;
  hasRole: boolean;
}

export class RateBargainDto extends RatePurchaseDto {}

export class ExtRateBargainDto extends RateBargainDto {
  bargainId: number;
  myId: number;
  hasRole: boolean;
}
