import { extname } from "path";
import * as moment from "moment";

const removeNotAllowedCharacters = (name: string): string => {
  const regex = /[^a-zA-Z0-9]/g
  return name.replace(regex, '');
}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  let name = file.originalname.split('.')[0];
  name = removeNotAllowedCharacters(name);

  const fileExtName = extname(file.originalname);
  const randomName = moment().format('YYYYMMDD-hhmmss');

  callback(null, `${randomName}--${name}${fileExtName}`);
};

