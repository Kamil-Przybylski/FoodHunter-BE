import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Food extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  rate: string;

  @Column({ type: 'boolean', select: false })
  isFavorite: boolean;

  @Column({ type: 'boolean', select: false })
  isPrivate: boolean;

  @Column({ type: 'boolean', select: false })
  isPlanned: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  photoPath: boolean;

}