import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { Tokens } from './auth.interface';
import { MyId, Public } from '../../common/decorators';
import { RtGuard } from '../../common/guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Post('logout')
  logout(@MyId() myId: number): Promise<void> {
    return this.authService.logout(myId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  refresh(@MyId() myId: number): Promise<Tokens> {
    return this.authService.refresh(myId);
  }
}
