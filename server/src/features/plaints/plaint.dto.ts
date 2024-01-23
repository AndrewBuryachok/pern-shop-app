import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsText, IsTitle } from '../../common/decorators';
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
  @IsText()
  text: string;
}

export class ExtUpdatePlaintDto extends UpdatePlaintDto {
  plaintId: number;
  myId: number;
  hasRole: boolean;
}

export class CreatePlaintDto extends UpdatePlaintDto {
  @ApiProperty()
  @IsTitle()
  title: string;

  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  receiverUserId: number;
}

export class ExtCreatePlaintDto extends CreatePlaintDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  senderUserId: number;
}

export class DeletePlaintDto extends PlaintIdDto {
  myId: number;
  hasRole: boolean;
}
