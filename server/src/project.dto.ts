import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsProjectExists } from './common/constraints';

export class ProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Validate(IsProjectExists)
  project: string;
}
