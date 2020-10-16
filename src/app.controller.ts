import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { FilePathsEnum } from "./app.config";

@Controller()
export class AppController {

  @Get(`${FilePathsEnum.FOOD_PATH}/:${FilePathsEnum.IMG_NAME}`)
  // @UseGuards(AuthGuard())
  seeUploadedFoodFile(@Param(FilePathsEnum.IMG_NAME) photoName: string, @Res() res: any) {
    return res.sendFile(photoName, { root: `./${FilePathsEnum.FOOD_PATH}` });
  }

  @Get(`${FilePathsEnum.AVATARS_PATH}/:${FilePathsEnum.IMG_NAME}`)
  // @UseGuards(AuthGuard())
  seeUploadedAvatarFile(@Param(FilePathsEnum.IMG_NAME) photoName: string, @Res() res: any) {
    return res.sendFile(photoName, { root: `./${FilePathsEnum.AVATARS_PATH}` });
  }

  @Get(`${FilePathsEnum.DEFAULT_PATH}/:${FilePathsEnum.IMG_NAME}`)
  // @UseGuards(AuthGuard())
  seeDefaultFile(@Param(FilePathsEnum.IMG_NAME) photoName: string, @Res() res: any) {
    return res.sendFile(photoName, { root: `./${FilePathsEnum.DEFAULT_PATH}` });
  }
  
}