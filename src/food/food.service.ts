import { CreateRestaurantDto } from './../restaurant/models/restaurant.models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodRepository } from './entites/food.repository';
import { CreateFoodDto, FoodDto } from './models/food.models';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Food } from './entites/food.entity';
import _ = require('lodash');
import { User } from '../auth/entities/user.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(FoodRepository)
    private foodRepository: FoodRepository,
  ) {}

  async getFoods(options: IPaginationOptions, page: string, user: User): Promise<Pagination<FoodDto>> {
    const foodsPagination: Pagination<Food> = await this.foodRepository.getFoods(options, user);
    const meta = foodsPagination.meta;
    meta.currentPage = +page || 1;
    return {
      items: _.map(foodsPagination?.items || [], item => new FoodDto(item, user)),
      links: foodsPagination.links,
      meta: meta,
    } as Pagination<FoodDto>;
  }

  async getFood(foodId: number, user: User): Promise<FoodDto> {
    const food: Food = await this.foodRepository.getFood(foodId);
    return new FoodDto(food, user);
  }

  async getUserFoods(userId: number, page: string, options: IPaginationOptions, user: User): Promise<Pagination<FoodDto>> {
    const foodsPagination: Pagination<Food> = await this.foodRepository.getUserFoods(userId, options, user);
    const meta = foodsPagination.meta;
    meta.currentPage = +page || 1;
    return {
      items: _.map(foodsPagination?.items || [], item => new FoodDto(item, user)),
      links: foodsPagination.links,
      meta: meta,
    } as Pagination<FoodDto>;
  }

  async createFood(
    createFoodDto: CreateFoodDto,
    createRestaurantDto: CreateRestaurantDto,
    user: User,
  ): Promise<FoodDto> {
    const food = await this.foodRepository.createSingle(createFoodDto, createRestaurantDto, user);
    return new FoodDto(food, user);
  }

  async setLikeForFood(foodId: number, user: User): Promise<FoodDto> {
    const food = await this.foodRepository.setLikeForFood(foodId, user.id);
    return new FoodDto(food, user);
  }
}
