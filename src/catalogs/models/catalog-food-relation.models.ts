import { IsInt } from "class-validator";

export class AddFoodToCatalogDto {
  @IsInt()
  foodId: number;

  @IsInt()
  catalogId: number;
}