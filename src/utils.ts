import { extname } from 'path';
import * as moment from 'moment';
import { FilePathsEnum, PAGINATOR_OPTIONS } from './app.config';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

export class FileUtil {
  private static removeNotAllowedCharacters(name: string): string {
    const regex = /[^a-zA-Z0-9]/g;
    return name.replace(regex, '');
  }

  public static imageFileFilter(
    req: any,
    file: Express.Multer.File,
    callback: (error: Error, acceptFile: boolean) => void,
  ) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  }

  public static editFileName(req: any, file: Express.Multer.File, callback: (error: Error, filename: string) => void) {
    let name = file.originalname.split('.')[0];
    name = FileUtil.removeNotAllowedCharacters(name);

    const fileExtName = extname(file.originalname);
    const randomName = moment().format('YYYYMMDD-hhmmss');

    callback(null, `${randomName}--${name}${fileExtName}`);
  }

  public static createPhotoPath(photoPath: string, dest: string) {
    return `${dest}/${photoPath}`;
  }

  public static returnDefaultAvatar(photoPath: string): string {
    if (photoPath) return photoPath;
    else return this.createPhotoPath(FilePathsEnum.DEFAULT_AVATAR, FilePathsEnum.DEFAULT_PATH);
  }
}

export class PaginatorUtil {
  public static getPageOptions(page: string): IPaginationOptions {
    return { page: +page || 1, limit: PAGINATOR_OPTIONS.food.limits };
  }

  public static getPageOptionsForInfiniteScroll(page: string): IPaginationOptions {
    const limit = (+page || 1) * PAGINATOR_OPTIONS.food.limits;
    return {page: 1, limit: limit };
  }
}
