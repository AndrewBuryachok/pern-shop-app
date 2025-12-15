import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
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
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<ExtJwtPayload> {
    const project = req.params.project;
    const user = await this.usersService.findUserById(project, payload.sub);
    if (!user) {
      throw new AppException(AuthError.INVALID_ACCESS_TOKEN);
    }
    if (user.banned) {
      throw new AppException(AuthError.BANNED);
    }
    return { ...payload, nick: user.nick, roles: user.roles };
  }
}
