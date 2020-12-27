import { Controller, UseGuards, Patch, Get, Param, Delete } from '@nestjs/common';
import { UserDto, UserShortDto } from '../models/auth.models';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { UrlPathsEnum } from 'src/app.config';

import { UserService } from './user.service';

@Controller(UrlPathsEnum.USER)
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(`${UrlPathsEnum.INFO}/:${UrlPathsEnum.ID}`)
  getUser(@Param(UrlPathsEnum.ID) userId: string, @GetUser() user: User): Promise<UserDto> {
    return this.userService.getUser(+userId);
  }

  @Get(`${UrlPathsEnum.FOLLOWERS}`)
  getAllUsersNotFollowedShort(@GetUser() user: User): Promise<UserShortDto[]> {
    return this.userService.getAllUsersNotFollowedShort(user);
  }

  @Get(`${UrlPathsEnum.FOLLOWERS}/:${UrlPathsEnum.ID}`)
  getUserFollowersShort(@Param(UrlPathsEnum.ID) userId: string, @GetUser() user: User): Promise<UserShortDto[]> {
    return this.userService.getUserFollowersShort(+userId);
  }

  @Patch(`${UrlPathsEnum.FOLLOWERS}/:${UrlPathsEnum.ID}/${UrlPathsEnum.ADD}/:${UrlPathsEnum.ITEM_ID}`)
  async addUserFollower(
    @Param(UrlPathsEnum.ID) authUserId: string,
    @Param(UrlPathsEnum.ITEM_ID) userId: string,
    @GetUser() user: User,
  ): Promise<UserShortDto[]> {
    await this.userService.addUserFollower(+userId, user);
    return this.userService.getAllUsersNotFollowedShort(user);
  }

  @Delete(`${UrlPathsEnum.FOLLOWERS}/:${UrlPathsEnum.ID}/${UrlPathsEnum.REMOVE}/:${UrlPathsEnum.ITEM_ID}`)
  async removeUserFollower(
    @Param(UrlPathsEnum.ID) authUserId: string,
    @Param(UrlPathsEnum.ITEM_ID) userId: string,
    @GetUser() user: User,
  ): Promise<UserShortDto[]> {
    await this.userService.removeUserFollower(+userId, user);
    return this.userService.getUserFollowersShort(+user.id);
  }
}
