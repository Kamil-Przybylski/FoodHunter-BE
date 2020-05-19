import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { RestaurantDto } from './../../restaurant/models/restaurant.models';
import { IsString, MinLength, MaxLength, IsInt, Max, Min, IsBoolean, IsOptional } from 'class-validator';
import { Food } from '../entites/food.entity';

export class UnparsedCreateFoodDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;

  @IsOptional()
  @IsString()
  rate: string;

  @IsOptional()
  @IsString()
  isFavorite: string;

  @IsOptional()
  @IsString()
  isPrivate: string;

  @IsOptional()
  @IsString()
  isPlanned: string;

  @IsString()
  foodTypeId: string;



  @IsString()
  restaurantId: string;

  @IsString()
  restaurantName: string;

  @IsString()
  restaurantFormattedAddress: string;

  @IsString()
  restaurantRating: string;

  @IsString()
  restaurantUrl: string;

  @IsString()
  restaurantWebsite: string;

  @IsString()
  restaurantTypes: string;

}

export class CreateFoodDto {
  name: string;
  description: string;
  rate: number;
  isFavorite: boolean;
  isPrivate: boolean;
  isPlanned: boolean;
  photoPath: string;
  restaurantId: string;
  foodTypeId: number;

  constructor(formData: UnparsedCreateFoodDto, photoPath: string, dest: string) {
    this.name = formData.name;
    this.description = formData.description || '';
    this.rate = this.getRate(formData.rate);
    this.isFavorite = this.getBoolean(formData.isFavorite);
    this.isPrivate = this.getBoolean(formData.isPrivate);
    this.isPlanned = this.getBoolean(formData.isPlanned);
    this.photoPath = this.createPhotoPath(photoPath, dest);
    this.restaurantId = formData.restaurantId;
    this.foodTypeId = +formData.foodTypeId;
  }

  getRate(rateString: string): number {
    if (+rateString > 6) return 6;
    if (+rateString >= 0 && +rateString <= 6) return +rateString;
    return 0;
  }

  getBoolean(booleanString): boolean {
    if (booleanString === 'true') return true;
    return false;
  }

  createPhotoPath(photoPath: string, dest: string) {
    return `${dest}/${photoPath}`;
  }
}

export class FoodDto { // FRONT-END DTO
  id: number;
  name: string;
  description: string;
  rate: number;
  isFavorite: boolean;
  isPrivate: boolean;
  isPlanned: boolean;
  photoPath: string;

  createDate: string;

  restaurantId: string;
  restaurant: RestaurantDto;
  foodTypeId: number;

  constructor(food: Food, restaurant?: Restaurant) {
    this.id = food.id;
    this.name = food.name;
    this.description = food.description;
    this.rate = food.rate;
    this.isFavorite = food.isFavorite;
    this.isPrivate = food.isPrivate;
    this.isPlanned = food.isPlanned;
    this.photoPath = food.photoPath;

    this.createDate = food.createDate;

    this.restaurantId = food.restaurantId;
    this.foodTypeId = food.foodTypeId;
    this.restaurant = restaurant ? new RestaurantDto(restaurant) : new RestaurantDto(food.restaurant);
  }
}