import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Role } from '../../features/users/role.enum';
import { Kind } from '../../features/leases/kind.enum';
import { TransportationStatus } from '../../features/transportations/transportation-status.enum';
import { Priority } from '../../features/tasks/priority.enum';
import { Mode } from '../enums';

export class Request {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  take?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  user?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  card?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(Mode)
  mode?: Mode;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(Role, { each: true })
  @Transform(({ value }) => value?.split(',').map((e) => +e))
  roles?: Role[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  city?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  shop?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  market?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  storage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  store?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  cell?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  item?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value && `%${value}%`)
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  type?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(Kind)
  @Type(() => Number)
  kind?: Kind;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(TransportationStatus)
  @Type(() => Number)
  status?: TransportationStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(Priority)
  @Type(() => Number)
  priority?: Priority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  rate?: number;
}
