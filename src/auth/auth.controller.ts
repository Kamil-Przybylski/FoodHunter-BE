import { AuthService } from './auth.service';
import { Controller, Post, Body, ValidationPipe, Param, ParseIntPipe, UseGuards, Patch, Get } from '@nestjs/common';
import { AuthSingInDto, AuthSingupDto, UserUpdateInfoDto, UserDto } from './models/auth.models';
import { AccessToken } from './models/jwt.models';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('/singup')
  singUp(@Body(ValidationPipe) authSingupDto: AuthSingupDto): Promise<void> {
    return this.authService.singUp(authSingupDto);
  }

  @Post('/singin')
  singin(@Body(ValidationPipe) authSingInDto: AuthSingInDto): Promise<AccessToken> {
    return this.authService.singIn(authSingInDto);
  }

  @Get('/login')
  @UseGuards(AuthGuard())
  login(@GetUser() user: User): Promise<UserDto> {
    return this.authService.login(user);
  }

  @Patch('/user/:id')
  @UseGuards(AuthGuard())
  updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body(ValidationPipe) userUpdateInfoDto: UserUpdateInfoDto,
    @GetUser() user: User
  ): Promise<UserDto> {
    return this.authService.updateUser(userUpdateInfoDto, user, userId);
  }

}
