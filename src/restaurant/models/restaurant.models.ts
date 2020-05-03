import { IsString, MinLength, MaxLength } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';

export class CreateRestaurantDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;
}

export class RestaurantDto { // FRONT-END DTO
  id: number;
  name: string;

  constructor(restaurant: Restaurant) {
    this.id = restaurant.id;
    this.name = restaurant.name;
  }
}