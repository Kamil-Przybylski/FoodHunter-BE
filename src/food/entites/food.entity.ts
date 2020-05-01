import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Food extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  rate: string;

  @Column({ type: 'boolean', select: false, nullable: false })
  isFavorite: boolean;

  @Column({ type: 'boolean', select: false, nullable: false })
  isPrivate: boolean;

  @Column({ type: 'boolean', select: false, nullable: false })
  isPlanned: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  photoPath: boolean;

}