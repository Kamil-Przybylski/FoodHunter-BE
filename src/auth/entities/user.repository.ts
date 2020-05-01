import { Repository, EntityRepository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getAll() {
    const query = this.createQueryBuilder('user');
    return await query.getMany();
  }
}