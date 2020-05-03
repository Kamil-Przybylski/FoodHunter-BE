import { IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsInt } from "class-validator";
import { Catalog } from "../entities/catalog.entity";

export class CreateCatalogDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;
  
  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @IsInt()
  userId: number;
}

export class CatalogDto { // FRONT-END DTO
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  createDate: string;

  userId: number;

  constructor(catalog: Catalog) {
    this.id = catalog.id;
    this.name = catalog.name;
    this.description = catalog.description;
    this.isPrivate = catalog.isPrivate;
    this.createDate = catalog.createDate;

    this.userId = catalog.userId;
  }
}