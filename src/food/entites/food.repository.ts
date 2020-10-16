import { Repository, EntityRepository } from 'typeorm';
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

@EntityRepository(Food)
export class FoodRepository extends Repository<Food> {

  async getAll(options: IPaginationOptions, user: User): Promise<Pagination<Food>> {
    const query = this.createQueryBuilder('food');
    query.leftJoinAndSelect('food.user', 'user');
    query.leftJoinAndSelect('food.restaurant', 'restaurant');
    query.leftJoin('food.comments', 'comments').addSelect(['comments.id', 'comments.userId']);
    
    query.orderBy('food.createDate', TypeOrmEnum.DESC);
    return await paginate<Food>(query, options);
  }

  async createSingle(
    createFoodDto: CreateFoodDto,
    createRestaurantDto: CreateRestaurantDto,
    user: User,
  ): Promise<Food> {
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
}
