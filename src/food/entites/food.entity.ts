import { Restaurant } from './../../restaurant/entities/restaurant.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { FoodType } from 'src/food-types/entities/food-type.entity';
import { Comments } from 'src/comments/entities/comment.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Catalog } from 'src/catalogs/entities/catalog.entity';

@Entity()
export class Food extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'timestamptz' })
  createDate: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'decimal', nullable: true })
  rate: number;

  @Column({ type: 'boolean' })
  isFavorite: boolean;

  @Column({ type: 'boolean' })
  isPrivate: boolean;

  @Column({ type: 'boolean' })
  isPlanned: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  photoPath: string;

  @Column()
  userId: number;
  @ManyToOne(type => User, user => user.foods, { eager: false })
  @JoinColumn({name: 'userId'})
  user: User;

  @Column({ type: 'varchar'})
  restaurantId: string
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

  @ManyToMany(type => User, user => user.likes)
  @JoinTable()
  likes: User[];


  @ManyToMany(type => Catalog, catalog => catalog.foods)
  @JoinTable()
  catalogs: Catalog[];

  @ManyToMany(type => Tag, tag => tag.foods)
  @JoinTable()
  tags: Tag[];
  
}
