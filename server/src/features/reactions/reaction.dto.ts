import { ApiProperty } from '@nestjs/swagger';
import { IsType } from '../../common/decorators';

export abstract class CreateReactionDto {
  @ApiProperty()
  @IsType()
  type: boolean;
}
