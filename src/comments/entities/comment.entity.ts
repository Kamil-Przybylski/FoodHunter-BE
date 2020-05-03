import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Food } from 'src/food/entites/food.entity';

@Entity()
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  comment: string;

  @Column({ type: 'timestamptz' })
  createDate: string;


  @Column()
  userId: number
  @ManyToOne(type => User, user => user.foods, { eager: false })
  @JoinColumn({name: 'userId'})
  user: User;

  @Column()
  foodId: number
  @ManyToOne(type => Food, food => food.comments, { eager: false })
  @JoinColumn({name: 'foodId'})
  food: Food;
  
}