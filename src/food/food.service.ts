import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodRepository } from './entites/food.repository';
import { User } from 'src/auth/entities/user.entity';
import { CreateFoodDto, FoodDto } from './models/food.models';

@Injectable()
export class FoodService {

  constructor(
    @InjectRepository(FoodRepository)
    private foodRepository: FoodRepository
  ) { }

  async getFoods(user: User) {
    return this.foodRepository.getAll();
  }

  async createFood(createFoodDto: CreateFoodDto, user: User): Promise<FoodDto> {
    const food = await this.foodRepository.createOne(createFoodDto, user);
    return new FoodDto(food);
  }
  
}
