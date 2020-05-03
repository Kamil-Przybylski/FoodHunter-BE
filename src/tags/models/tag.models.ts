import { Tag } from './../entities/tag.entity';
import { IsInt, IsString, IsOptional, MaxLength, MinLength } from "class-validator";

export class CreateTagDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;
}

export class AddFoodToTagDto {
  @IsInt()
  foodId: number;

  @IsInt()
  tagId: number;
}

export class TagDto { // FRONT-END DTO
  id: number;
  name: string;
  description: string;

  constructor(catalog: Tag) {
    this.id = catalog.id;
    this.name = catalog.name;
    this.description = catalog.description;
  }
}