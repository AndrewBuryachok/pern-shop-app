import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsAdvertExists } from '../../common/constraints';
import { CreateServiceDto, EditServiceDto } from '../services/service.dto';

export class AdvertIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsAdvertExists)
  @Type(() => Number)
  advertId: number;
}

export class CreateAdvertDto extends CreateServiceDto {}

export class ExtCreateAdvertDto extends CreateAdvertDto {
  myId: number;
  hasRole: boolean;
}

export class EditAdvertDto extends EditServiceDto {}

export class ExtEditAdvertDto extends EditAdvertDto {
  advertId: number;
  myId: number;
  hasRole: boolean;
}

export class DeleteAdvertDto extends AdvertIdDto {
  myId: number;
  hasRole: boolean;
}

export class RespondAdvertDto extends CreateServiceDto {}

export class ExtRespondAdvertDto extends RespondAdvertDto {
  advertId: number;
  myId: number;
  hasRole: boolean;
}
