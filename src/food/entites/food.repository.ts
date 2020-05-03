import { Repository, EntityRepository } from 'typeorm';
import { Food } from './food.entity';
import { User } from 'src/auth/entities/user.entity';
import { CreateFoodDto } from '../models/food.models';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Food)
export class FoodRepository extends Repository<Food> {

  async getAll() {
    const query = this.createQueryBuilder('food');
    query.leftJoinAndSelect('food.restaurant', 'restaurant');
    query.leftJoinAndSelect('food.foodType', 'foodType');
    query.leftJoinAndSelect('food.comments', 'comments');
    query.leftJoinAndSelect('food.tagFoodRelations', 'tagFoodRelations');
    return await query.getMany();
  }

  async createOne(createFoodDto: CreateFoodDto, user: User): Promise<Food> {
    const { 
      name, 
      description, 
      rate, 
      isFavorite, 
      isPlanned, 
      isPrivate, 
      photoPath,
      restaurantId, 
      foodTypeId 
    } = createFoodDto;

    const food = new Food();
    food.name = name;
    food.description = description;
    food.rate = rate;
    food.isFavorite = isFavorite;
    food.isPlanned = isPlanned;
    food.isPrivate = isPrivate;
    food.photoPath = photoPath;

    food.userId = user.id;
    food.restaurantId = restaurantId;
    food.foodTypeId = foodTypeId;

    try {
      await food.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return food;
  }
}