import { ApiProperty } from '@nestjs/swagger';
import { IsCoordinate, IsName } from '../../common/decorators';

export abstract class CreatePlaceDto {
  @ApiProperty()
  @IsName()
  name: string;

  @ApiProperty()
  @IsCoordinate()
  x: number;

  @ApiProperty()
  @IsCoordinate()
  y: number;
}
