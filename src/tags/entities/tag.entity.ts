import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TagFoodRelation } from './tag-food-relation.entity';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;


  @OneToMany(type => TagFoodRelation, tagFoodRelation => tagFoodRelation.tag, { eager: true })
  tagFoodRelations: TagFoodRelation[];
}