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

  async register(dto: AuthDto): Promise<Tokens> {
    const hash = await hashData(dto.password);
    const user = await this.usersService.createUser({ ...dto, password: hash });
    return this.signTokens(user);
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.usersService.findUserByName(dto.name);
    if (!user || !(await compareHash(dto.password, user.password))) {
      throw new AppException(AuthError.INVALID_CREDENTIALS);
    }
    return this.signTokens(user);
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.removeUserToken({ userId });
  }

  async refresh(userId: number): Promise<Tokens> {
    const user = await this.usersService.findUserById(userId);
    return this.signTokens(user);
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.usersService.findUserById(userId);
    if (!(await compareHash(dto.oldPassword, user.password))) {
      throw new AppException(AuthError.INVALID_CREDENTIALS);
    }
    const hash = await hashData(dto.newPassword);
    await this.usersService.updateUserPassword(user, hash);
  }

  private async signTokens(user: User): Promise<Tokens> {
    const payload = { sub: user.id, name: user.name };
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
    await this.usersService.addUserToken({ userId: user.id, token: hash });
    return { id: user.id, name: user.name, roles: user.roles, access, refresh };
  }
}
