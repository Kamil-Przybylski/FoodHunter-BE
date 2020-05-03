import { FoodDto } from './../../food/models/food.models';
import { Repository, EntityRepository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CatalogFoodRelation } from './catalog-food-relation.entity';
import { AddFoodToCatalogDto } from '../models/catalog-food-relation.models';
import { Food } from 'src/food/entites/food.entity';

@EntityRepository(CatalogFoodRelation)
export class CatalogFoodRelationRepository extends Repository<CatalogFoodRelation> {

  async getAllForCatalog(catalogId: number): Promise<CatalogFoodRelation[]> {
    const query = this.createQueryBuilder('catalog_food_relation');
    query.where('catalog_food_relation.catalogId = :catalogId', { catalogId });
    query.leftJoinAndSelect('catalog_food_relation.food', 'food');
    const catalogFoodRelation = await query.getMany();

    return catalogFoodRelation;
  }

  async getAllForFood(foodId: number): Promise<Food[]> {
    const query = this.createQueryBuilder('catalog_food_relation');
    return null;
  }

  async createOne(addFoodToCatalogDto: AddFoodToCatalogDto, user: User): Promise<CatalogFoodRelation> {
    const { 
      catalogId,
      foodId 
    } = addFoodToCatalogDto;

    const catalogFoodRelation = new CatalogFoodRelation();
    catalogFoodRelation.catalogId = catalogId;
    catalogFoodRelation.foodId = foodId;

    try {
      await catalogFoodRelation.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return catalogFoodRelation;
  }

}