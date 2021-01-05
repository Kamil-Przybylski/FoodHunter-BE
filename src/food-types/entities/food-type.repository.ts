import { Repository, EntityRepository } from 'typeorm';
import { FoodType } from './food-type.entity';
import { CreateFoodTypeDto } from '../models/food-type.models';
import { InternalServerErrorException } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';

@EntityRepository(FoodType)
export class FoodTypeRepository extends Repository<FoodType> {

  async getAll() {
    const query = this.createQueryBuilder('food_type');
    return await query.getMany();
  }

  async createOne(createFoodTypeDto: CreateFoodTypeDto, user: User): Promise<FoodType> {
    const { name, description } = createFoodTypeDto;

    const foodType = new FoodType();
    foodType.name = name;
    foodType.description = description;

    try {
      await foodType.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return foodType;
  }

}