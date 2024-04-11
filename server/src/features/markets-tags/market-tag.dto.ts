import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsMarketExists, IsMarketTagExists } from '../../common/constraints';
import { CreateTagDto } from '../tags/tag.dto';

export class MarketTagIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsMarketTagExists)
  @Type(() => Number)
  marketTagId: number;
}

export class CreateMarketTagDto extends CreateTagDto {
  @ApiProperty()
  @IsId()
  @Validate(IsMarketExists)
  marketId: number;
}

export class ExtCreateMarketTagDto extends CreateMarketTagDto {
  myId: number;
  hasRole: boolean;
}

export class EditMarketTagDto extends CreateTagDto {}

export class ExtEditMarketTagDto extends EditMarketTagDto {
  marketTagId: number;
  myId: number;
  hasRole: boolean;
}
