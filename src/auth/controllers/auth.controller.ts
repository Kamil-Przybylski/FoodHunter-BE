import { AuthService } from './auth.service';
import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import {
  AuthSingInDto,
  AuthSingupDto,
  UnparsedUserUpdatePhotoDto,
  UserAuthDto,
  UserUpdateInfoDto,
  UserUpdatePhotoDto,
} from '../models/auth.models';
import { AccessToken } from '../models/jwt.models';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilePathsEnum, UrlPathsEnum } from '../../app.config';
import { FileUtil } from '../../utils';

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

  @Patch(UrlPathsEnum.INFO)
  @UseGuards(AuthGuard())
  updateUserInfo(@Body(ValidationPipe) userUpdateInfoDto: UserUpdateInfoDto, @GetUser() user: User): Promise<UserAuthDto> {
    return this.authService.updateUser(userUpdateInfoDto, user);
  }

  @Patch(UrlPathsEnum.PHOTO)
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor(FilePathsEnum.PHOTO, {
      storage: diskStorage({
        destination: `./${FilePathsEnum.AVATARS_PATH}`,
        filename: FileUtil.editFileName,
      }),
      fileFilter: FileUtil.imageFileFilter,
    }),
  )
  updateUserPhoto(
    @Body(ValidationPipe) userUpdateInfoDto: UnparsedUserUpdatePhotoDto,
    @UploadedFile() photo: any,
    @GetUser() user: User,
  ): Promise<UserAuthDto> {
    return this.authService.updateUser(new UserUpdatePhotoDto(userUpdateInfoDto, photo.filename, `${FilePathsEnum.AVATARS_PATH}`), user);
  }
}
