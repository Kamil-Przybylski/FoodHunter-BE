import { Repository, EntityRepository } from 'typeorm';
import { Food } from './food.entity';

@EntityRepository(Food)
export class FoodRepository extends Repository<Food> {
  async getAll() {
    const query = this.createQueryBuilder('food');
    return await query.getMany();
  }
}