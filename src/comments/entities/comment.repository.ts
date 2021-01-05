import { Repository, EntityRepository } from 'typeorm';
import { Comments } from './comment.entity';
import { CreateCommentDto } from '../models/comment.models';
import { InternalServerErrorException } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import { TypeOrmEnum } from '../../typeorm.config';

@EntityRepository(Comments)
export class CommentsRepository extends Repository<Comments> {

  async getAll(): Promise<Comments[]> {
    const query = this.createQueryBuilder('comments');
    return await query.getMany();
  }

  async getByFoodId(foodId: number, user: User): Promise<Comments[]> {
    const query = this.createQueryBuilder('comments');
    query.where('comments.foodId = :foodId', { foodId });
    query.leftJoinAndSelect('comments.user', 'user');
    
    query.orderBy('comments.createDate', TypeOrmEnum.DESC);
    return await query.getMany();
  }

  async createOne(createCommentDto: CreateCommentDto, user: User): Promise<Comments[]> {
    const { 
      comment,
      foodId
    } = createCommentDto;

    const comments = new Comments();
    comments.comment = comment;
    comments.foodId = foodId;
    comments.userId = user.id;
    comments.user = user;
    comments.createDate = (new Date()).toISOString();

    try {
      await comments.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return await this.getByFoodId(foodId, user);
  }
}