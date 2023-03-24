import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from '../../common/decorators';
import { CreateUserDto } from '../users/user.dto';

export class AuthDto extends CreateUserDto {}

export class UpdatePasswordDto {
  @ApiProperty()
  @IsPassword()
  oldPassword: string;

  @ApiProperty()
  @IsPassword()
  newPassword: string;
}
