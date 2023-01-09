import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsCityExists } from '../../common/constraints';
import { CreatePlaceDto } from '../places/place.dto';

export class CityIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCityExists)
  @Type(() => Number)
  cityId: number;
}

export class CreateCityDto extends CreatePlaceDto {}

export class ExtCreateCityDto extends CreateCityDto {
  myId: number;
}

export class EditCityDto extends CreatePlaceDto {}

export class ExtEditCityDto extends EditCityDto {
  cityId: number;
  myId: number;
}
