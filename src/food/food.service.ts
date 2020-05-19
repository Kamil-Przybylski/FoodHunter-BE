import { CreateRestaurantDto } from './../restaurant/models/restaurant.models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodRepository } from './entites/food.repository';
import { User } from 'src/auth/entities/user.entity';
import {
  CreateFoodDto,
  FoodDto,
} from './models/food.models';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(FoodRepository)
    private foodRepository: FoodRepository,
  ) {}

  async getFoods(
    user: User,
  ): Promise<FoodDto[]> {
    const foods = await this.foodRepository.getAll();
    return foods.map(
      food => new FoodDto(food),
    );
  }

  async createFood(
    createFoodDto: CreateFoodDto,
    createRestaurantDto: CreateRestaurantDto,
    user: User,
  ): Promise<FoodDto> {
    const foodWithRestaurant = await this.foodRepository.createOneWithRestaurant(
      createFoodDto,
      createRestaurantDto,
      user,
    );
    return new FoodDto(foodWithRestaurant.food, foodWithRestaurant.restaurant);
  }
}
