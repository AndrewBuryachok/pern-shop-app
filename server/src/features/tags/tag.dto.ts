import { ApiProperty } from '@nestjs/swagger';
import { IsName, IsPrice } from '../../common/decorators';

export abstract class CreateTagDto {
  @ApiProperty()
  @IsName()
  name: string;

  @ApiProperty()
  @IsPrice()
  price: number;
}
