import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsPrice, IsId, IsActivity, IsText } from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';

export abstract class EditServiceDto {
  @ApiProperty()
  @IsActivity()
  activity: string;

  @ApiProperty()
  @IsText()
  text: string;

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
