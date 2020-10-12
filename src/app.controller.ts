import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { FilePathsEnum } from "./app.config";

@Controller()
export class AppController {

  @Get(`${FilePathsEnum.FOOD_PATH}/:${FilePathsEnum.IMGPATH}`)
  // @UseGuards(AuthGuard())
  seeUploadedFoodFile(@Param(FilePathsEnum.IMGPATH) photo: string, @Res() res: any) {
    return res.sendFile(photo, { root: `./${FilePathsEnum.FOOD_PATH}` });
  }

  @Get(`${FilePathsEnum.AVATARS_PATH}/:${FilePathsEnum.IMGPATH}`)
  // @UseGuards(AuthGuard())
  seeUploadedAvatarFile(@Param(FilePathsEnum.IMGPATH) photo: string, @Res() res: any) {
    return res.sendFile(photo, { root: `./${FilePathsEnum.AVATARS_PATH}` });
  }

  @Get(`${FilePathsEnum.DEFAULT_PATH}/:${FilePathsEnum.IMGPATH}`)
  // @UseGuards(AuthGuard())
  seeDefaultFile(@Param(FilePathsEnum.IMGPATH) photo: string, @Res() res: any) {
    return res.sendFile(photo, { root: `./${FilePathsEnum.DEFAULT_PATH}` });
  }
  
}