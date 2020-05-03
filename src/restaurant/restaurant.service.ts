import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantRepository } from './entities/restaurant.repository';
import { CreateRestaurantDto, RestaurantDto } from './models/restaurant.models';

@Injectable()
export class RestaurantService {

  constructor(
    @InjectRepository(RestaurantRepository)
    private restaurantRepository: RestaurantRepository
  ) { }

  async getRestaurants(user: User) {
    return this.restaurantRepository.getAll();
  }

  async createRestaurants(createRestaurantDto: CreateRestaurantDto, user: User): Promise<RestaurantDto> {
    const restaurant = await this.restaurantRepository.createOne(createRestaurantDto, user);
    return new RestaurantDto(restaurant);
  }

}
