import { Tag } from './tag.entity';
import { Entity, BaseEntity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";
import { Food } from "src/food/entites/food.entity";

@Entity()
export class TagFoodRelation extends BaseEntity {

  @PrimaryColumn() 
  foodId: number
  @ManyToOne(type => Food, food => food.tagFoodRelations, { eager: false })
  @JoinColumn({name: 'foodId'})
  food: Food;

  @PrimaryColumn()
  tagId: number
  @ManyToOne(type => Tag, tag => tag.tagFoodRelations, { eager: false })
  @JoinColumn({name: 'tagId'})
  tag: Tag;
}