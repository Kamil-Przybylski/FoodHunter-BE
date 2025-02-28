import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodTypeRepository } from './entities/food-type.repository';
import { User } from 'src/auth/entities/user.entity';
import { CreateFoodTypeDto, FoodTypeDto } from './models/food-type.models';

@Injectable()
export class FoodTypesService {

  constructor(
    @InjectRepository(FoodTypeRepository)
    private foodTypeRepository: FoodTypeRepository
  ) { }

  async getFoodTypes(user: User) {
    return this.foodTypeRepository.getAll();
  }

  async createFoodType(createFoodTypeDto: CreateFoodTypeDto, user: User): Promise<FoodTypeDto> {
    const foodType = await this.foodTypeRepository.createOne(createFoodTypeDto, user);
    return new FoodTypeDto(foodType);
  }

}
