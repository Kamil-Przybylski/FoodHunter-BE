import { AuthService } from './auth.service';
import { Controller, Post, Body, ValidationPipe, UseGuards, Get } from '@nestjs/common';
import { AuthSingInDto, AuthSingupDto, UserAuthDto } from '../models/auth.models';
import { AccessToken } from '../models/jwt.models';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { UrlPathsEnum } from 'src/app.config';

@Controller(UrlPathsEnum.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`/${UrlPathsEnum.SINGUP}`)
  singUp(@Body(ValidationPipe) authSingupDto: AuthSingupDto): Promise<void> {
    return this.authService.singUp(authSingupDto);
  }

  @Post(`/${UrlPathsEnum.SINGIN}`)
  singin(@Body(ValidationPipe) authSingInDto: AuthSingInDto): Promise<AccessToken> {
    return this.authService.singIn(authSingInDto);
  }

  @Get(`/${UrlPathsEnum.LOGIN}`)
  @UseGuards(AuthGuard())
  login(@GetUser() user: User): Promise<UserAuthDto> {
    return this.authService.login(user);
  }
}
