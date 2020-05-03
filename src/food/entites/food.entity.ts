import { Restaurant } from './../../restaurant/entities/restaurant.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { FoodType } from 'src/food-types/entities/food-type.entity';
import { CatalogFoodRelation } from 'src/catalogs/entities/catalog-food-relation.entity';
import { Comments } from 'src/comments/entities/comment.entity';
import { TagFoodRelation } from 'src/tags/entities/tag-food-relation.entity';

@Entity()
export class Food extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  rate: number;

  @Column({ type: 'boolean', select: false })
  isFavorite: boolean;

  @Column({ type: 'boolean', select: false })
  isPrivate: boolean;

  @Column({ type: 'boolean', select: false })
  isPlanned: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  photoPath: string;

  @Column()
  userId: number;
  @ManyToOne(type => User, user => user.foods, { eager: false })
  @JoinColumn({name: 'userId'})
  user: User;

  @Column()
  restaurantId: number
  @ManyToOne(type => Restaurant, restaurant => restaurant.foods, { eager: false })
  @JoinColumn({name: 'restaurantId'})
  restaurant: Restaurant;

  @Column()
  foodTypeId: number
  @ManyToOne(type => FoodType, foodType => foodType.foods, { eager: false })
  @JoinColumn({name: 'foodTypeId'})
  foodType: FoodType;


  @OneToMany(type => Comments, comment => comment.food, { eager: true })
  comments: Comments[];
  
  @OneToMany(type => CatalogFoodRelation, catalog => catalog.food, { eager: true })
  catalogFoodRelations: CatalogFoodRelation[];

  @OneToMany(type => TagFoodRelation, tagFoodRelation => tagFoodRelation.food, { eager: true })
  tagFoodRelations: TagFoodRelation[];

}