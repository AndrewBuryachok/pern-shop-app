import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

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
  @IsInt()
  @Type(() => Number)
  user?: number = 0;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  mode?: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value?.split(','))
  filters?: string[] = [];

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string = '';

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  item?: number = 0;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string = '';

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  type?: number = 0;
}
