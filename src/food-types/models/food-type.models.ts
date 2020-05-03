import { IsString, MinLength, MaxLength } from 'class-validator';
import { FoodType } from '../entities/food-type.entity';

export class CreateFoodTypeDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description: string;
}

export class FoodTypeDto { // FRONT-END DTO
  id: number;
  name: string;
  description: string;

  constructor(foodType: FoodType) {
    this.id = foodType.id;
    this.name = foodType.name;
    this.description = foodType.description;
  }
}