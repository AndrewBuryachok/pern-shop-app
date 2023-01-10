import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class Request {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  take?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search?: string;
}
