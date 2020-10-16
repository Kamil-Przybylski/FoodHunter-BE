import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from '../entities/user.repository';
import { UserAuthDto, UserUpdateInfoDto } from '../models/auth.models';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async updateUser(userUpdateInfoDto: UserUpdateInfoDto, user: User): Promise<UserAuthDto> {
    if (user.id !== userUpdateInfoDto.id) throw new NotFoundException('userId from path is not equal to userId from DTO');

    const updatedUser = await this.userRepository.updateUser(userUpdateInfoDto, user);
    return new UserAuthDto(updatedUser);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.getAll();
  }
}
