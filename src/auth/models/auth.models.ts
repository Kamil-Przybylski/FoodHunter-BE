import { IsString, MinLength, MaxLength, Matches, IsEmail, IsOptional, IsDate, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';
import { FileUtil } from '../../utils';
import { User } from '../entities/user.entity';

export class AuthSingupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(
    // /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    /.*/,
    { message: 'Wymagana min. 1 wielka litera i min. 1 znak specjalny.' },
  )
  password: string;
}

export class AuthSingInDto {
  @IsString()
  @MinLength(2)
  email: string;

  @IsString()
  password: string;
}

export class UserUpdateInfoDto {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  about: string;
}

export class UnparsedUserUpdatePhotoDto {
  @IsString()
  id: string;
}
export class UserUpdatePhotoDto {
  id: number;
  photoPath: string;

  constructor(updateInfoDto: UnparsedUserUpdatePhotoDto, photoPath: string, dest: string) {
    this.id = +updateInfoDto.id;
    this.photoPath = FileUtil.createPhotoPath(photoPath, dest);
  }
}

export class UserAuthDto {
  // FRONT-END DTO
  id: number;
  username: string;
  email: string;
  photoPath: string;
  about: string;
  foodsCount: number;
  followersCount: number;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.photoPath = FileUtil.returnDefaultAvatar(user.photoPath);
    this.about = user.about;
    this.foodsCount = user.foodsCount || 0;
    this.followersCount = user.followersCount || 0;
  }
}

export class UserDto {
  // FRONT-END DTO
  id: number;
  username: string;
  about: string;
  photoPath: string;
  foodsCount: number;
  followersCount: number;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.about = user.about;
    this.photoPath = FileUtil.returnDefaultAvatar(user.photoPath);
    this.foodsCount = user.foodsCount || 0;
    this.followersCount = user.followersCount || 0;
  }
}

export class UserShortDto {
  // FRONT-END DTO
  id: number;
  username: string;
  photoPath: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.photoPath = FileUtil.returnDefaultAvatar(user.photoPath);
  }
}
