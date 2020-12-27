import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantRepository } from './entities/restaurant.repository';
import { CreateSingleRestaurantDto, RestaurantDto } from './models/restaurant.models';
import _ = require('lodash');

@Injectable()
export class RestaurantService {

  constructor(
    @InjectRepository(RestaurantRepository)
    private restaurantRepository: RestaurantRepository
  ) { }

  async getRestaurants(user: User): Promise<RestaurantDto[]> {
    const restaurants = await this.restaurantRepository.getAll();
    return _.map(restaurants || [], restaurant => new RestaurantDto(restaurant));
  }

  async createRestaurants(createRestaurantDto: CreateSingleRestaurantDto, user: User): Promise<RestaurantDto> {
    const restaurant = await this.restaurantRepository.createOne(createRestaurantDto, user);
    return new RestaurantDto(restaurant);
  }

}
