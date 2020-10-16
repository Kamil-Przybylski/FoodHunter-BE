import { Controller, Body, ValidationPipe, UseGuards, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserUpdateInfoDto, UserAuthDto, UnparsedUserUpdateInfoDto } from '../models/auth.models';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { FilePathsEnum, UrlPathsEnum } from 'src/app.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUtil } from 'src/utils';
import { UserService } from './user.service';

@Controller(UrlPathsEnum.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    return this.userService.updateUser(new UserUpdateInfoDto(userUpdateInfoDto, photo.filename, `${FilePathsEnum.AVATARS_PATH}`), user);
  }
}
