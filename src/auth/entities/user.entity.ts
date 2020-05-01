import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  salt: string;

  @Column({ type: 'date', nullable: false })
  createDate: string;

  @Column({ type: 'date', nullable: false })
  birthDate: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  photoPath: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  about: string;


  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}