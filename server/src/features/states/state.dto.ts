import { ApiProperty } from '@nestjs/swagger';
import { IsAmount, IsPrice } from '../../common/decorators';

export class EditStateDto {
  @ApiProperty()
  @IsPrice()
  price: number;
}

export class ExtEditStateDto extends EditStateDto {
  @ApiProperty()
  @IsAmount()
  amount: number;
}
