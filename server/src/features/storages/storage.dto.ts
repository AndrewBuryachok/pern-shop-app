import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsStorageExists } from '../../common/constraints';
import {
  CreatePlaceWithCardDto,
  EditPlaceWithPriceDto,
} from '../places/place.dto';

export class StorageIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  @Type(() => Number)
  storageId: number;
}

export class CreateStorageDto extends CreatePlaceWithCardDto {}

export class ExtCreateStorageDto extends CreateStorageDto {
  myId: number;
}

export class EditStorageDto extends EditPlaceWithPriceDto {}

export class ExtEditStorageDto extends EditStorageDto {
  storageId: number;
  myId: number;
}
