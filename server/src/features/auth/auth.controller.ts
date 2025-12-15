import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto, UpdatePasswordDto } from './auth.dto';
import { ProjectDto } from '../../project.dto';
import { Tokens } from './auth.interface';
import { MyId, Public } from '../../common/decorators';
import { RtGuard } from '../../common/guards';

@ApiTags(':project/auth')
@Controller(':project/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(
    @Param() { project }: ProjectDto,
    @Body() dto: AuthDto,
  ): Promise<Tokens> {
    return this.authService.register(project, dto);
  }

  @Public()
  @Post('login')
  login(
    @Param() { project }: ProjectDto,
    @Body() dto: AuthDto,
  ): Promise<Tokens> {
    return this.authService.login(project, dto);
  }

  @Post('logout')
  logout(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
  ): Promise<void> {
    return this.authService.logout(project, myId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  refresh(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
  ): Promise<Tokens> {
    return this.authService.refresh(project, myId);
  }

  @Patch('password')
  updatePassword(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Body() dto: UpdatePasswordDto,
  ): Promise<void> {
    return this.authService.updatePassword(project, myId, dto);
  }
}
