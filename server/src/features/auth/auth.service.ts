import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { AuthDto, UpdatePasswordDto } from './auth.dto';
import { Tokens } from './auth.interface';
import { compareHash, hashData } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { AuthError } from './auth-error.enum';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(project: string, dto: AuthDto): Promise<Tokens> {
    const hash = await hashData(dto.password);
    const user = await this.usersService.createUser(project, {
      ...dto,
      password: hash,
    });
    return this.signTokens(project, user);
  }

  async login(project: string, dto: AuthDto): Promise<Tokens> {
    const user = await this.usersService.findUserByNick(project, dto.nick);
    if (user?.blockedUntil > new Date()) {
      throw new AppException(AuthError.BLOCKED);
    }
    if (!user || !(await compareHash(dto.password, user.password))) {
      if (user) {
        await this.usersService.addUserAttempts(project, user);
      }
      throw new AppException(AuthError.INVALID_CREDENTIALS);
    }
    await this.usersService.removeUserAttempts(project, user);
    return this.signTokens(project, user);
  }

  async logout(project: string, userId: number): Promise<void> {
    await this.usersService.removeUserToken(project, { userId });
  }

  async refresh(project: string, userId: number): Promise<Tokens> {
    const user = await this.usersService.findUserById(project, userId);
    return this.signTokens(project, user);
  }

  async updatePassword(
    project: string,
    userId: number,
    dto: UpdatePasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findUserById(project, userId);
    if (!(await compareHash(dto.oldPassword, user.password))) {
      throw new AppException(AuthError.INVALID_CREDENTIALS);
    }
    const hash = await hashData(dto.newPassword);
    await this.usersService.updateUserPassword(project, user, hash);
  }

  private async signTokens(project: string, user: User): Promise<Tokens> {
    const payload = { sub: user.id };
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('AT_SECRET'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    const hash = await hashData(refresh);
    await this.usersService.addUserToken(project, {
      userId: user.id,
      token: hash,
    });
    return {
      id: user.id,
      nick: user.nick,
      avatar: user.avatar,
      roles: user.roles,
      access,
      refresh,
    };
  }
}
