import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { User } from '../entities/user.entity';
import { UserRepository } from '../entities/user.repository';
import { UserAuthDto, UserDto, UserShortDto, UserUpdateInfoDto, UserUpdatePhotoDto } from '../models/auth.models';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getUser(userId: number): Promise<UserDto>  {
    const user = await this.userRepository.getUser(userId);
    return new UserDto(user);
  }

  async getAllUsersNotFollowedShort(user: User): Promise<UserShortDto[]>  {
    const userList = await this.userRepository.getAllNotFollowed(user);
    return _.map(userList, user => new UserShortDto(user));
  }

  async getUserFollowersShort(userId: number): Promise<UserShortDto[]>  {
    const currentUser = await this.userRepository.getUserFollowers(userId);
    return _.map(currentUser?.followers || [], user => new UserShortDto(user));
  }

  async addUserFollower(userId: number, authUser: User): Promise<void>  {
    await this.userRepository.addUserFollower(userId, authUser);
  }

  async removeUserFollower(userId: number, authUser: User): Promise<void>  {
    await this.userRepository.removeUserFollower(userId, authUser);
  }

}
