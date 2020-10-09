import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Food } from 'src/food/entites/food.entity';

export const JOIN_KEY = '$$$';

@Entity()
export class Restaurant extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @Column({ type: 'varchar', length: 30 }) // TEMP ZA MAŁO !!!
  name: string;

  @Column({ type: 'varchar', length: 255 })
  formatted_address: string;

  @Column({ type: 'decimal' })
  rating: number;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 255 })
  website: string;

  @Column({ type: 'varchar', length: 255 })
  types: string;


  @OneToMany(type => Food, food => food.user, { eager: true })
  foods: Food[];


  factorArrayToStringTypes(types: string[]): string {
    return types.join(JOIN_KEY);
  }

  factorStringToArrayTypes(): string[] {
    return this.types.split(JOIN_KEY);
  }
}