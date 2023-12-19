import { ApiProperty } from '@nestjs/swagger';
import {
  IsPrice,
  IsItem,
  IsAmount,
  IsIntake,
  IsKit,
  IsOptionalDescription,
} from '../../common/decorators';

export abstract class CreateThingDto {
  @ApiProperty()
  @IsItem()
  item: number;

  @ApiProperty()
  @IsOptionalDescription()
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
