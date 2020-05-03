import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatalogRepository } from './entities/catalog.repository';
import { CreateCatalogDto, CatalogDto } from './models/catalogs.models';
import { User } from 'src/auth/entities/user.entity';
import { CatalogFoodRelationRepository } from './entities/catalog-food-relation.repository';
import { AddFoodToCatalogDto } from './models/catalog-food-relation.models';
import { CatalogFoodRelation } from './entities/catalog-food-relation.entity';
import { Food } from 'src/food/entites/food.entity';
import { FoodDto } from 'src/food/models/food.models';

@Injectable()
export class CatalogsService {

  constructor(
    @InjectRepository(CatalogRepository)
    private catalogRepository: CatalogRepository,
    @InjectRepository(CatalogFoodRelationRepository)
    private catalogFoodRelationRepository: CatalogFoodRelationRepository,
  ) { }

  async getCatalogs(user: User): Promise<CatalogDto[]> {
    const catalogs = await this.catalogRepository.getAll();
    return catalogs.map(catalog =>new CatalogDto(catalog) );
  }

  async createCatalog(createCatalogDto: CreateCatalogDto, user: User): Promise<CatalogDto> {
    const catalog = await this.catalogRepository.createOne(createCatalogDto, user);
    return new CatalogDto(catalog);
  }



  async getFoodForCatalog(catalogId: number, user: User): Promise<FoodDto[]> {
    const catalogFoodRelation = await this.catalogFoodRelationRepository.getAllForCatalog(catalogId);
    return catalogFoodRelation.map(item => new FoodDto(item.food))
  }

  async addFoodToCatalog(addFoodToCatalogDto: AddFoodToCatalogDto, catalogId: number, user: User): Promise<CatalogFoodRelation> {
    return this.catalogFoodRelationRepository.createOne(addFoodToCatalogDto, user);
  }
  
}
