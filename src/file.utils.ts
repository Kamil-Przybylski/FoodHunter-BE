import { extname } from "path";
import * as moment from "moment";

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = moment().format('YYYYMMDD-hhmmss');

  callback(null, `${randomName}--${name}${fileExtName}`);
};