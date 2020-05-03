import { Repository, EntityRepository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { CreateRestaurantDto } from '../models/restaurant.models';
import { User } from 'src/auth/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {

  async getAll() {
    const query = this.createQueryBuilder('restaurant');
    return await query.getMany();
  }

  async createOne(createRestaurantDto: CreateRestaurantDto, user: User): Promise<Restaurant> {
    const { name } = createRestaurantDto;

    const restaurant = new Restaurant();
    restaurant.name = name;

    try {
      await restaurant.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return restaurant;
  }

}