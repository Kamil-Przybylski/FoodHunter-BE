import { Entity, BaseEntity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";
import { Catalog } from "./catalog.entity";
import { Food } from "src/food/entites/food.entity";

@Entity()
export class CatalogFoodRelation extends BaseEntity {

  @PrimaryColumn() 
  foodId: number
  @ManyToOne(type => Food, food => food.catalogFoodRelations, { eager: false })
  @JoinColumn({name: 'foodId'})
  food: Food;

  @PrimaryColumn()
  catalogId: number
  @ManyToOne(type => Catalog, catalog => catalog.catalogFoodRelations, { eager: false })
  @JoinColumn({name: 'userId'})
  catalog: Catalog;
}