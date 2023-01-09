import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId, IsType } from '../../common/decorators';
import { IsPollExists } from '../../common/constraints';

export class CreateVoteDto {
  @ApiProperty()
  @IsId()
  @Validate(IsPollExists)
  pollId: number;

  @ApiProperty()
  @IsType()
  type: boolean;
}

export class ExtCreateVoteDto extends CreateVoteDto {
  myId: number;
}
