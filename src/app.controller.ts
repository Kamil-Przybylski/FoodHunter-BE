import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class AppController {

  @Get('uploads/foods/:imgpath')
  // @UseGuards(AuthGuard())
  seeUploadedFile(@Param('imgpath') photo: string, @Res() res: any) {
    return res.sendFile(photo, { root: './uploads/foods' });
  }
  
}