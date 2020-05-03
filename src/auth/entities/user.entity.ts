import { Comments } from './../../comments/entities/comment.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Food } from 'src/food/entites/food.entity';
import { Catalog } from 'src/catalogs/entities/catalog.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  salt: string;

  @Column({ type: 'timestamptz' })
  createDate: string;

  @Column({ type: 'timestamptz', nullable: true })
  birthDate: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photoPath: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  about: string;


  @OneToMany(type => Food, food => food.user, { eager: true })
  foods: Food[];

  @OneToMany(type => Catalog, catalog => catalog.user, { eager: true })
  catalogs: Catalog[];

  @OneToMany(type => Comments, comments => comments.user, { eager: true })
  comments: Comments[];


  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}