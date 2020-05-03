import { Repository, EntityRepository } from 'typeorm';
import { Comments } from './comment.entity';
import { CreateCommentDto } from '../models/comment.models';
import { User } from 'src/auth/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Comments)
export class CommentsRepository extends Repository<Comments> {

  async getAll() {
    const query = this.createQueryBuilder('comments');
    return await query.getMany();
  }

  async createOne(createCommentDto: CreateCommentDto, user: User): Promise<Comments> {
    const { 
      comment,
      foodId
    } = createCommentDto;

    const comments = new Comments();
    comments.comment = comment;
    comments.foodId = foodId;
    comments.userId = user.id;
    comments.createDate = (new Date()).toISOString();

    try {
      await comments.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return comments;
  }
}