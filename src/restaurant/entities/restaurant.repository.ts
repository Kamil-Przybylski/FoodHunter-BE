import { Repository, EntityRepository } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  async getAll() {
    const query = this.createQueryBuilder('restaurant');
    return await query.getMany();
  }
}