import { IsString, MinLength, MaxLength, Matches, IsEmail, IsOptional, IsDate, IsNumber, IsDateString } from "class-validator";
import { User } from "../entities/user.entity";

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
    { message: 'Wymagana min. 1 wielka litera i min. 1 znak specjalny.' }
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

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsOptional()
  @IsDateString()
  birthDate: string;

  @IsOptional()
  @IsString()
  photoPath: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  about: string;
}

export class UserAuthDto { // FRONT-END DTO
  id: number;
  username: string;
  email: string;
  birthDate: string;
  photoPath: string;
  about: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username; 
    this.email = user.email;
    this.birthDate = user.birthDate;
    this.photoPath = user.photoPath;
    this.about = user.about;
  }
}

export class UserDto { // FRONT-END DTO
  id: number;
  username: string;
  photoPath: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username; 
    this.photoPath = user.photoPath;
  }
}