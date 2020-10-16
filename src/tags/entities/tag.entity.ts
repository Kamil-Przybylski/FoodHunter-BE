import { Food } from 'src/food/entites/food.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;


  @ManyToMany(type => Food, food => food.tags)
  foods: Food[];
}