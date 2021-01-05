import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSingInDto, AuthSingupDto, UserAuthDto, UserUpdateInfoDto, UserUpdatePhotoDto } from '../models/auth.models';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, JwtPayload } from '../models/jwt.models';
import { User } from '../entities/user.entity';
import { UserRepository } from '../entities/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async singUp(authSingupDto: AuthSingupDto): Promise<void> {
    return this.userRepository.signUp(authSingupDto);
  }

  async singIn(authCredentialsDto: AuthSingInDto): Promise<AccessToken> {
    const user = await this.userRepository.validatePasswordAndReturnUser(authCredentialsDto);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user: new UserAuthDto(user) };
  }

  async login(user: User): Promise<UserAuthDto> {
    return new UserAuthDto(user);
  }

  async updateUser(userUpdateDto: UserUpdateInfoDto | UserUpdatePhotoDto, authUser: User): Promise<UserAuthDto> {
    if (authUser.id !== userUpdateDto.id) throw new NotFoundException('userId from path is not equal to userId from DTO');

    const updatedUser = await this.userRepository.updateUser(userUpdateDto, authUser);
    return new UserAuthDto(updatedUser);
  }
}
