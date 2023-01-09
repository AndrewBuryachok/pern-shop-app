import { ApiProperty } from '@nestjs/swagger';
import {
  IsDescription,
  IsPrice,
  IsItem,
  IsAmount,
  IsIntake,
  IsKit,
} from '../../common/decorators';

export abstract class CreateThingDto {
  @ApiProperty()
  @IsItem()
  item: number;

  @ApiProperty()
  @IsDescription()
  description: string;

  @ApiProperty()
  @IsPrice()
  price: number;
}

export abstract class CreateThingWithAmountDto extends CreateThingDto {
  @ApiProperty()
  @IsAmount()
  amount: number;

  @ApiProperty()
  @IsIntake()
  intake: number;

  @ApiProperty()
  @IsKit()
  kit: number;
}
