import {
  Repository,
  EntityRepository,
} from 'typeorm';
import { Food } from './food.entity';
import { User } from 'src/auth/entities/user.entity';
import { CreateFoodDto } from '../models/food.models';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateRestaurantDto } from 'src/restaurant/models/restaurant.models';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import * as fs from 'fs';
import * as path from 'path';

@EntityRepository(Food)
export class FoodRepository extends Repository<
  Food
> {
  async getAll() {
    const query = this.createQueryBuilder(
      'food',
    );
    query.leftJoinAndSelect(
      'food.restaurant',
      'restaurant',
    );
    query.leftJoinAndSelect(
      'food.foodType',
      'foodType',
    );
    query.leftJoinAndSelect(
      'food.comments',
      'comments',
    );
    query.leftJoinAndSelect(
      'food.tagFoodRelations',
      'tagFoodRelations',
    );
    return await query.getMany();
  }

  async createSingle(
    createFoodDto: CreateFoodDto,
    user: User,
  ): Promise<Food> {
    const {
      name,
      description,
      rate,
      isFavorite,
      isPlanned,
      isPrivate,
      photoPath,
      restaurantId,
      foodTypeId,
    } = createFoodDto;

    const food = new Food();
    food.name = name;
    food.description = description;
    food.rate = rate;
    food.isFavorite = isFavorite;
    food.isPlanned = isPlanned;
    food.isPrivate = isPrivate;
    food.photoPath = photoPath;
    food.createDate = new Date().toISOString();

    food.userId = user.id;
    food.restaurantId = restaurantId;
    food.foodTypeId = foodTypeId;

    try {
      await food.save();
    } catch (error) {
      throw new InternalServerErrorException(
        error.message,
      );
    }

    return food;
  }

  async createOneWithRestaurant(
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
 
    food.userId = user.id;
    food.restaurant = restaurant;
    food.restaurantId = createRestaurantDto.id;
    food.foodTypeId = createFoodDto.foodTypeId;
    
    try {
      await restaurant.save();
    } catch (error) {
      console.log(error);
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
