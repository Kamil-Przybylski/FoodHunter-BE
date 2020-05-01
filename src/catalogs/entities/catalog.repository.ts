import { Repository, EntityRepository } from 'typeorm';
import { Catalog } from './catalog.entity';

@EntityRepository(Catalog)
export class CatalogRepository extends Repository<Catalog> {
  async getAll() {
    const query = this.createQueryBuilder('catalog');
    return await query.getMany();
  }
}