import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsStorageExists, IsStorageTagExists } from '../../common/constraints';
import { CreateTagDto } from '../tags/tag.dto';

export class StorageTagIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageTagExists)
  @Type(() => Number)
  storageTagId: number;
}

export class CreateStorageTagDto extends CreateTagDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  storageId: number;
}

export class ExtCreateStorageTagDto extends CreateStorageTagDto {
  myId: number;
  hasRole: boolean;
}

export class EditStorageTagDto extends CreateTagDto {}

export class ExtEditStorageTagDto extends EditStorageTagDto {
  storageTagId: number;
  myId: number;
  hasRole: boolean;
}
