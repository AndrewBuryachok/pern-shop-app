import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsPrice } from '../../common/decorators';
import { IsCardExists, IsStorageExists } from '../../common/constraints';
import { CreatePlaceDto } from '../places/place.dto';

export class StorageIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  @Type(() => Number)
  storageId: number;
}

export class CreateStorageDto extends CreatePlaceDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;

  @ApiProperty()
  @IsPrice()
  price: number;
}

export class ExtCreateStorageDto extends CreateStorageDto {
  myId: number;
}

export class EditStorageDto extends CreatePlaceDto {}

export class ExtEditStorageDto extends EditStorageDto {
  storageId: number;
  myId: number;
}
