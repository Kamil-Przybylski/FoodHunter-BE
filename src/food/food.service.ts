import { CreateRestaurantDto } from './../restaurant/models/restaurant.models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodRepository } from './entites/food.repository';
import { User } from 'src/auth/entities/user.entity';
import { CreateFoodDto, FoodDto } from './models/food.models';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Food } from './entites/food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(FoodRepository)
    private foodRepository: FoodRepository,
  ) {}

  async getFoods(options: IPaginationOptions, user: User): Promise<Pagination<FoodDto>> {
    const foodsPagination: Pagination<Food> = await this.foodRepository.getAll(options, user);
    return {
      items: foodsPagination.items.map(item => new FoodDto(item)),
      links: foodsPagination.links,
      meta: foodsPagination.meta,
    } as Pagination<FoodDto>;
  }

  async createFood(
    createFoodDto: CreateFoodDto,
    createRestaurantDto: CreateRestaurantDto,
    user: User,
  ): Promise<FoodDto> {
    const food = await this.foodRepository.createSingle(createFoodDto, createRestaurantDto, user);
    console.log();
    return new FoodDto(food);
  }
}
