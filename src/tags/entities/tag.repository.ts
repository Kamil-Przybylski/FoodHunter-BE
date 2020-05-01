import { Repository, EntityRepository } from 'typeorm';
import { Tag } from './tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async getAll() {
    const query = this.createQueryBuilder('tag');
    return await query.getMany();
  }
}