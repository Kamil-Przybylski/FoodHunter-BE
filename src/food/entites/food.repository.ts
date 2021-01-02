import { Repository, EntityRepository, getConnection } from 'typeorm';
import { Food } from './food.entity';
import { User } from 'src/auth/entities/user.entity';
import { CreateFoodDto } from '../models/food.models';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateRestaurantDto } from 'src/restaurant/models/restaurant.models';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import * as fs from 'fs';
import * as path from 'path';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { TypeOrmEnum } from 'src/typeorm.config';
import _ = require('lodash');

@EntityRepository(Food)
export class FoodRepository extends Repository<Food> {
  async getFoods(options: IPaginationOptions, user: User): Promise<Pagination<Food>> {
    const query = this.createQueryBuilder('food');
    query.where('food.userId IN (:...ids)', { ids: [...user.followerIds, user.id] });
    query.leftJoinAndSelect('food.user', 'user');
    query.leftJoinAndSelect('food.restaurant', 'restaurant');
    query.leftJoin('food.comments', 'comments').addSelect(['comments.id', 'comments.userId']);
    query.leftJoin('food.likes', 'likes').addSelect('likes.id');

    query.orderBy('food.createDate', TypeOrmEnum.DESC);
    return await paginate<Food>(query, options);
  }

  async getFood(foodId: number): Promise<Food> {
    const query = this.createQueryBuilder('food');
    query.where('food.id = :id', { id: foodId });
    query.leftJoinAndSelect('food.user', 'user');
    query.leftJoinAndSelect('food.restaurant', 'restaurant');
    query.leftJoin('food.comments', 'comments').addSelect(['comments.id', 'comments.userId']);
    query.leftJoin('food.likes', 'likes').addSelect('likes.id');

    return await query.getOne();
  }

  async getUserFoods(userId: number, options: IPaginationOptions, user: User): Promise<Pagination<Food>> {
    const query = this.createQueryBuilder('food');
    query.where('food.userId = :id', { id: userId });
    query.leftJoinAndSelect('food.user', 'user');
    query.leftJoinAndSelect('food.restaurant', 'restaurant');
    query.leftJoin('food.comments', 'comments').addSelect(['comments.id', 'comments.userId']);
    query.leftJoin('food.likes', 'likes').addSelect('likes.id');

    query.orderBy('food.createDate', TypeOrmEnum.DESC);
    return await paginate<Food>(query, options);
  }

  async createSingle(createFoodDto: CreateFoodDto, createRestaurantDto: CreateRestaurantDto, user: User): Promise<Food> {
    const restaurant = new Restaurant();
    restaurant.id = createRestaurantDto.id;
    restaurant.name = createRestaurantDto.name;
    restaurant.formatted_address = createRestaurantDto.formatted_address;
    restaurant.rating = createRestaurantDto.rating;
    restaurant.url = createRestaurantDto.url;
    restaurant.website = createRestaurantDto.website;
    restaurant.types = createRestaurantDto.types;

    const food = new Food();
    food.name = createFoodDto.name;
    food.description = createFoodDto.description;
    food.rate = createFoodDto.rate;
    food.isFavorite = createFoodDto.isFavorite;
    food.isPlanned = createFoodDto.isPlanned;
    food.isPrivate = createFoodDto.isPrivate;
    food.photoPath = createFoodDto.photoPath;
    food.createDate = new Date().toISOString();

    food.user = user;
    food.userId = user.id;
    food.restaurant = restaurant;
    food.restaurantId = createRestaurantDto.id;
    food.foodTypeId = createFoodDto.foodTypeId;

    try {
      await restaurant.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
    try {
      await food.save();
    } catch (error) {
      fs.unlinkSync(path.join(__dirname, '../../../', food.photoPath));
      throw new InternalServerErrorException();
    }

    return food;
  }

  async setLikeForFood(foodId: number, userId: number) {
    const food = await this.getFood(foodId);

    const userQuery = getConnection().getRepository(User).createQueryBuilder('user');
    userQuery.where('user.id = :id', { id: userId });
    userQuery.leftJoin('user.likes', 'likes').addSelect('likes.id');
    const user = await userQuery.getOne();

    if (_.findIndex(food.likes, userLikes => userLikes.id === user.id) !== -1) {
      food.likes = _.filter(food.likes, userLike => userLike.id !== user.id);
      user.likes = _.filter(user.likes, foodLike => foodLike.id !== foodId);
    } else {
      food.likes.push(user);
      user.likes.push(food);
    }

    try {
      await food.save();
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return food;
  }
}
