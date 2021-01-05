import { Repository, EntityRepository } from 'typeorm';
import { AuthSingupDto, AuthSingInDto, UserUpdatePhotoDto, UserUpdateInfoDto } from '../models/auth.models';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as _ from 'lodash';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // AUTH

  async getUserData(credential: string, isEmail?: boolean): Promise<User> {
    const query = this.createQueryBuilder('user');
    if (isEmail) query.where('user.email = :email', { email: credential });
    else query.where('user.username = :username', { username: credential });

    query.loadRelationCountAndMap('user.followersCount', 'user.followers');
    query.loadRelationCountAndMap('user.foodsCount', 'user.foods');

    return await query.getOne();
  }

  async signUp(authSingupDto: AuthSingupDto): Promise<void> {
    const { username, email, password } = authSingupDto;

    const user = this.create();
    user.username = username;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.createDate = new Date().toISOString();

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') throw new ConflictException(error && error.detail);
      else throw new InternalServerErrorException(error && error.message);
    }
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validatePasswordAndReturnUser(authSingInDto: AuthSingInDto): Promise<User> {
    const { email, password } = authSingInDto;
    const user = await this.getUserData(email, true);

    if (user && (await user.validatePassword(password))) return user;
    else return null;
  }

  // USER

  async getUser(userId: number): Promise<User> {
    const query = this.createQueryBuilder('user');
    query.where('user.id = :id', { id: userId });

    query.loadRelationCountAndMap('user.followersCount', 'user.followers');
    query.loadRelationCountAndMap('user.foodsCount', 'user.foods');

    return await query.getOne();
  }

  async updateUser(userUpdateDto: UserUpdateInfoDto | UserUpdatePhotoDto, authUser: User): Promise<User> {
    const user = await this.getUserData(authUser.username);

    if ('about' in userUpdateDto) user.about = userUpdateDto.about;
    if ('photoPath' in userUpdateDto) user.photoPath = userUpdateDto.photoPath;

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return user;
  }

  async addUserFollower(followerId: number, authUser: User): Promise<void> {
    const follower = await this.createQueryBuilder('user')
      .where('user.id = :id', { id: followerId })
      .getOne();
    const followerFollowers = await this.createQueryBuilder('user')
      .where('user.id IN (:...ids)', {
        ids: [...follower.followerIds, authUser.id],
      })
      .getMany();
    const userFollowers = await this.createQueryBuilder('user')
      .where('user.id IN (:...ids)', {
        ids: [...authUser.followerIds, follower.id],
      })
      .getMany();

    authUser.followers = _.unionBy(userFollowers, 'id');
    follower.followers = _.unionBy(followerFollowers, 'id');

    try {
      await authUser.save();
      await follower.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeUserFollower(followerId: number, authUser: User): Promise<void> {
    const user = await this.createQueryBuilder('user')
      .where('user.id = :id', { id: authUser.id })
      .leftJoinAndSelect('user.followers', 'follower')
      .getOne();

    const follower = await this.createQueryBuilder('user')
      .where('user.id = :id', { id: followerId })
      .leftJoinAndSelect('user.followers', 'follower')
      .getOne();

    user.followers = _.filter(user.followers, follower => follower.id !== followerId);
    follower.followers = _.filter(follower.followers, follower => follower.id !== followerId);

    try {
      await user.save();
      await follower.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserFollowers(userId: number): Promise<User> {
    const query = this.createQueryBuilder('user');
    query.where('user.id = :id', { id: userId });
    query.leftJoinAndSelect('user.followers', 'followers');

    return await query.getOne();
  }

  async getAllNotFollowed(authUser: User): Promise<User[]> {
    const query = this.createQueryBuilder('user');
    query.where('user.id NOT IN (:...ids)', { ids: [...authUser.followerIds, authUser.id] });

    return await query.getMany();
  }
}
