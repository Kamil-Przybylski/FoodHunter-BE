import { IsString, MinLength, MaxLength, IsInt, Max, Min, IsBoolean, IsOptional } from 'class-validator';
import { Food } from '../entites/food.entity';

export class CreateFoodDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  rate: number;

  @IsOptional()
  @IsBoolean()
  isFavorite: boolean;

  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @IsOptional()
  @IsBoolean()
  isPlanned: boolean;

  @IsOptional()
  @IsString()
  photoPath: string;


  @IsInt()
  restaurantId: number;

  @IsInt()
  foodTypeId: number;
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

  restaurantId: number;
  foodTypeId: number;

  constructor(food: Food) {
    this.id = food.id;
    this.name = food.name;
    this.description = food.description;
    this.rate = food.rate;
    this.isFavorite = food.isFavorite;
    this.isPrivate = food.isPrivate;
    this.isPlanned = food.isPlanned;
    this.photoPath = food.photoPath;

    this.restaurantId = food.restaurantId;
    this.foodTypeId = food.foodTypeId;
  }
}