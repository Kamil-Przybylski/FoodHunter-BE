import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatalogRepository } from './entities/catalog.repository';
import { CreateCatalogDto, CatalogDto } from './models/catalogs.models';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class CatalogsService {

  constructor(
    @InjectRepository(CatalogRepository)
    private catalogRepository: CatalogRepository,
  ) { }

  async getCatalogs(user: User): Promise<CatalogDto[]> {
    const catalogs = await this.catalogRepository.getAll();
    return catalogs.map(catalog =>new CatalogDto(catalog) );
  }

  async createCatalog(createCatalogDto: CreateCatalogDto, user: User): Promise<CatalogDto> {
    const catalog = await this.catalogRepository.createOne(createCatalogDto, user);
    return new CatalogDto(catalog);
  }

  // async getFoodForCatalog(catalogId: number, user: User): Promise<FoodDto[]> {
  //   const catalogFoodRelation = await this.catalogFoodRelationRepository.getAllForCatalog(catalogId);
  //   return catalogFoodRelation.map(item => new FoodDto(item.food, user))
  // }

  // async addFoodToCatalog(addFoodToCatalogDto: AddFoodToCatalogDto, catalogId: number, user: User): Promise<CatalogFoodRelation> {
  //   return this.catalogFoodRelationRepository.createOne(addFoodToCatalogDto, user);
  // }
  
}
