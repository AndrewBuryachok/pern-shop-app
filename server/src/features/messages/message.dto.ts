import { ApiProperty } from '@nestjs/swagger';
import { Validate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsMessageExists, IsUserExists } from '../../common/constraints';
import { CreateReplyDto } from '../replies/reply.dto';

export class MessageIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsMessageExists)
  @Type(() => Number)
  messageId: number;
}

export class EditMessageDto extends CreateReplyDto {}

export class ExtEditMessageDto extends EditMessageDto {
  messageId: number;
  myId: number;
}

export class CreateMessageDto extends EditMessageDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;

  @ApiProperty()
  @ValidateIf((_, value) => value !== 0)
  @IsId()
  @Validate(IsMessageExists)
  messageId: number;
}

export class ExtCreateMessageDto extends CreateMessageDto {
  myId: number;
}

export class DeleteMessageDto extends MessageIdDto {
  myId: number;
}
