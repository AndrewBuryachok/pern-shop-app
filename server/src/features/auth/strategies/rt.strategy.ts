import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../auth.interface';
import { compareHash } from '../../../common/utils';
import { AppException } from '../../../common/exceptions';
import { AuthError } from '../auth-error.enum';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'rt-secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    const token = req.get('Authorization').replace('Bearer', '').trim();
    const user = await this.usersService.findUserById(payload.sub);
    if (!user || !user.token || !(await compareHash(token, user.token))) {
      throw new AppException(AuthError.INVALID_REFRESH_TOKEN);
    }
    return payload;
  }
}
