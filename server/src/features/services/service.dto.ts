import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsPrice, IsDescription, IsId } from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';

export abstract class EditServiceDto {
  @ApiProperty()
  @IsDescription()
  description: string;

  @ApiProperty()
  @IsPrice()
  price: number;
}

export class CreateServiceDto extends EditServiceDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}
