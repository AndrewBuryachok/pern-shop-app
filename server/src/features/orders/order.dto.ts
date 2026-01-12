import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsAmount,
  IsDescription,
  IsId,
  IsIntake,
  IsItem,
  IsKit,
} from '../../common/decorators';
import { IsOrderExists } from '../../common/constraints';
import {
  CompleteTransportationDto,
  CreateTransportationDto,
  EditTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';
import { Item } from '../things/item.enum';

export class OrderIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsOrderExists)
  @Type(() => Number)
  orderId: number;
}

export class ExtOrderIdDto extends OrderIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateOrderDto extends CreateTransportationDto {
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
}

export class ExtCreateOrderDto extends CreateOrderDto {
  myId: number;
  hasRole: boolean;
}

export class EditOrderDto extends EditTransportationDto {
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
}

export class ExtEditOrderDto extends EditOrderDto {
  orderId: number;
  myId: number;
  hasRole: boolean;
}

export class TakeOrderDto extends TakeTransportationDto {}

export class ExtTakeOrderDto extends TakeOrderDto {
  orderId: number;
  myId: number;
  hasRole: boolean;
}

export class CompleteOrderDto extends CompleteTransportationDto {}

export class ExtCompleteOrderDto extends CompleteOrderDto {
  orderId: number;
  myId: number;
  hasRole: boolean;
}
