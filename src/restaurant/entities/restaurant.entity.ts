import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Food } from 'src/food/entites/food.entity';

@Entity()
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;


  @OneToMany(type => Food, food => food.user, { eager: true })
  foods: Food[];
}