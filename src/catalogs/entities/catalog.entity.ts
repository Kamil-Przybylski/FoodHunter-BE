import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CatalogFoodRelation } from './catalog-food-relation.entity';

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

  @OneToMany(type => CatalogFoodRelation, catalogFoodRelation => catalogFoodRelation.catalog, { eager: true })
  catalogFoodRelations: CatalogFoodRelation[];

}