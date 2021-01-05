import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Food } from '../../food/entites/food.entity';

@Entity()
export class Catalog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ type: 'boolean', select: false })
  isPrivate: boolean;

  @Column({ type: 'timestamptz' })
  createDate: string;


  @Column()
  userId: number
  @ManyToOne(type => User, user => user.foods, { eager: false })
  @JoinColumn({name: 'userId'})
  user: User;

  @ManyToMany(type => Food, food => food.catalogs)
  foods: Food[];

}