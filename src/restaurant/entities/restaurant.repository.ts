import {
  Repository,
  EntityRepository,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { CreateSingleRestaurantDto } from '../models/restaurant.models';
import { User } from 'src/auth/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<
  Restaurant
> {
  async getAll() {
    const query = this.createQueryBuilder(
      'restaurant',
    );
    return await query.getMany();
  }

  async createOne(
    createRestaurantDto: CreateSingleRestaurantDto,
    user: User,
  ): Promise<Restaurant> {
    const {
      id,
      name,
      formatted_address,
      rating,
      url,
      website,
      types,
    } = createRestaurantDto;

    const restaurant = new Restaurant();
    restaurant.id = id;
    restaurant.name = name;
    restaurant.formatted_address = formatted_address;
    restaurant.rating = rating;
    restaurant.url = url;
    restaurant.website = website;
    restaurant.types = restaurant.factorArrayToStringTypes(
      types,
    );

    try {
      await restaurant.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return restaurant;
  }
}
