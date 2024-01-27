import { ApiProperty } from '@nestjs/swagger';
import { IsText } from '../../common/decorators';

export abstract class CreateReplyDto {
  @ApiProperty()
  @IsText()
  text: string;
}
