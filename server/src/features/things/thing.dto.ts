import { ApiProperty } from '@nestjs/swagger';
import {
  IsPrice,
  IsItem,
  IsAmount,
  IsIntake,
  IsKit,
  IsDescription,
} from '../../common/decorators';

export abstract class CreateThingDto {
  @ApiProperty()
  @IsItem()
  item: number;

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
