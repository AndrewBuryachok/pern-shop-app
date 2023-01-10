import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ExtJwtPayload, JwtPayload } from '../auth.interface';
import { AppException } from '../../../common/exceptions';
import { AuthError } from '../auth-error.enum';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('AT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<ExtJwtPayload> {
    const user = await this.usersService.findUserById(payload.sub);
    if (!user) {
      throw new AppException(AuthError.INVALID_ACCESS_TOKEN);
    }
    return { ...payload, roles: user.roles };
  }
}
