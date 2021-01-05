import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Food } from '../../food/entites/food.entity';

@Entity()
export class FoodType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;


  @OneToMany(type => Food, food => food.user, { eager: true })
  foods: Food[];
}