import { Repository, EntityRepository } from 'typeorm';
import { Comments } from './comment.entity';

@EntityRepository(Comments)
export class CommentsRepository extends Repository<Comments> {
  async getAll() {
    const query = this.createQueryBuilder('comments');
    return await query.getMany();
  }
}