import { ApiProperty } from '@nestjs/swagger';
import {
  IsPrice,
  IsItem,
  IsAmount,
  IsIntake,
  IsKit,
  IsDescription,
} from '../../common/decorators';
import { Item } from './item.enum';

export abstract class CreateThingDto {
  @ApiProperty()
  @IsItem()
  item: Item;

  @ApiProperty()
  @IsDescription()
  description: string;

  @ApiProperty()
  @IsAmount()
  amount: number;

  @ApiProperty()
  @IsIntake()
  intake: number;

  @ApiProperty()
  @IsKit()
  kit: number;

  @ApiProperty()
  @IsPrice()
  price: number;
}
