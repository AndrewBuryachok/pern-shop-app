import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsRequiredDescription } from '../../common/decorators';
import { IsPlaintExists, IsUserExists } from '../../common/constraints';

export class PlaintIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsPlaintExists)
  @Type(() => Number)
  plaintId: number;
}

export class UpdatePlaintDto {
  @ApiProperty()
  @IsRequiredDescription()
  description: string;
}

export class ExtUpdatePlaintDto extends UpdatePlaintDto {
  myId: number;
  plaintId: number;
}

export class CreatePlaintDto extends UpdatePlaintDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class ExtCreatePlaintDto extends CreatePlaintDto {
  myId: number;
}

export class DeletePlaintDto extends PlaintIdDto {
  myId: number;
}
