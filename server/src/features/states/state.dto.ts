import { ApiProperty } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';
import { IsAmount, IsPrice } from '../../common/decorators';

export class EditStateDto {
  @ApiProperty()
  @IsPrice()
  price: number;
}

export class ExtEditStateDto extends EditStateDto {
  @ApiProperty()
  @ValidateIf((_, value) => value !== 0)
  @IsAmount()
  amount: number;
}
