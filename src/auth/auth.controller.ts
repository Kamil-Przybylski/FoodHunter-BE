import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Param,
  ParseIntPipe,
  UseGuards,
  Patch,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  AuthSingInDto,
  AuthSingupDto,
  UserUpdateInfoDto,
  UserAuthDto,
  UnparsedUserUpdateInfoDto,
} from './models/auth.models';
import { AccessToken } from './models/jwt.models';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { FilePathsEnum, UrlPathsEnum } from 'src/app.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUtil } from 'src/utils';

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

  @Patch(`/${UrlPathsEnum.USER}`)
  @UseInterceptors(
    FileInterceptor(FilePathsEnum.PHOTO, {
      storage: diskStorage({
        destination: `./${FilePathsEnum.AVATARS_PATH}`,
        filename: FileUtil.editFileName,
      }),
      fileFilter: FileUtil.imageFileFilter,
    }),
  )
  @UseGuards(AuthGuard())
  updateUser(
    @Body(ValidationPipe) userUpdateInfoDto: UnparsedUserUpdateInfoDto,
    @UploadedFile() photo: any,
    @GetUser() user: User,
  ): Promise<UserAuthDto> {
    return this.authService.updateUser(
      new UserUpdateInfoDto(userUpdateInfoDto, photo.filename, `${FilePathsEnum.AVATARS_PATH}`),
      user,
    );
  }
}
