import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/entities/user.repository';
import { AuthSingInDto, AuthSingupDto, UserUpdateInfoDto, UserAuthDto } from './models/auth.models';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, JwtPayload } from './models/jwt.models';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private jwtService: JwtService
  ) { }

  async singUp(authSingupDto: AuthSingupDto): Promise<void> {
    return this.userRepository.singUp(authSingupDto);
  }

  async singIn(authCredentialsDto: AuthSingInDto): Promise<AccessToken> {
    const user = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { username: user.username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken, user: new UserAuthDto(user) };
  }

  async login(user: User): Promise<UserAuthDto> {
    return new UserAuthDto(user);
  }

  async updateUser(userUpdateInfoDto: UserUpdateInfoDto, user: User): Promise<UserAuthDto> {
    if (user.id !== userUpdateInfoDto.id) throw new NotFoundException('userId from path is not equal to userId from DTO');
    
    const updatedUser = await this.userRepository.updateUser(userUpdateInfoDto, user);
    return new UserAuthDto(updatedUser);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

}