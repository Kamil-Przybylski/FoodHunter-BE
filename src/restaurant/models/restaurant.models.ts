import { IsString, MinLength, MaxLength, IsInt, IsArray } from 'class-validator';
import { Restaurant, JOIN_KEY } from '../entities/restaurant.entity';
import { UnparsedCreateFoodDto } from 'src/food/models/food.models';

export class CreateSingleRestaurantDto {
  @IsString()
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsString()
  formatted_address: string;

  @IsInt()
  rating: number;
  
  @IsString()
  url: string;
  
  @IsString()
  website: string;

  @IsString({each: true})
  types: string[];
}

export class CreateRestaurantDto {
  id: string;
  name: string;
  formatted_address: string;
  rating: number;
  url: string;
  website: string;
  types: string;

  constructor(formData: UnparsedCreateFoodDto) {
    this.id = formData.restaurantId;
    this.name = formData.restaurantName;
    this.formatted_address = formData.restaurantFormattedAddress;
    this.rating = this.getRate(formData.restaurantRating);
    this.url = formData.restaurantUrl;
    this.website = formData.restaurantWebsite;
    this.types = formData.restaurantTypes;
  }

  getRate(rateString: string): number {
    if (+rateString > 5) return 5;
    if (+rateString >= 0 && +rateString <= 6) return +rateString;
    return 0;
  }
}

export class RestaurantDto { // FRONT-END DTO
  id: string;
  name: string;
  formatted_address: string;
  rating: number;
  url: string;
  website: string;
  types: string[];

  constructor(restaurant: Restaurant) {
    this.id = restaurant.id;
    this.name = restaurant.name;
    this.formatted_address = restaurant.formatted_address;
    this.rating = +restaurant.rating;
    this.url = restaurant.url;
    this.website = restaurant.website;
    this.types = restaurant.factorStringToArrayTypes();
  }
}