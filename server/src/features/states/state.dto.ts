import { ApiProperty } from '@nestjs/swagger';
import { IsPrice } from '../../common/decorators';

export class EditStateDto {
  @ApiProperty()
  @IsPrice()
  price: number;
}
