import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsText } from '../../common/decorators';
import { IsAnswerExists, IsPlaintExists } from '../../common/constraints';

export class AnswerIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsAnswerExists)
  @Type(() => Number)
  answerId: number;
}

export class EditAnswerDto {
  @ApiProperty()
  @IsText()
  text: string;
}

export class ExtEditAnswerDto extends EditAnswerDto {
  answerId: number;
  myId: number;
  hasRole: boolean;
}

export class CreateAnswerDto extends EditAnswerDto {
  @ApiProperty()
  @IsId()
  @Validate(IsPlaintExists)
  plaintId: number;
}

export class ExtCreateAnswerDto extends CreateAnswerDto {
  myId: number;
}

export class DeleteAnswerDto extends AnswerIdDto {
  myId: number;
  hasRole: boolean;
}
