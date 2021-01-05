import { Injectable } from '@nestjs/common';
import { CreateCommentDto, CommentDto } from './models/comment.models';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsRepository } from './entities/comment.repository';
import _ = require('lodash');
import { User } from '../auth/entities/user.entity';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(CommentsRepository)
    private commentsRepository: CommentsRepository
  ) { }

  async getCommentsByFoodId(foodId: number, user: User): Promise<CommentDto[]> {
    const comments = await this.commentsRepository.getByFoodId(foodId, user);
    return _.map(comments || [], comment => new CommentDto(comment));
  }
  
  async createComment(createCommentDto: CreateCommentDto, user: User): Promise<CommentDto[]> {
    const comments = await this.commentsRepository.createOne(createCommentDto, user);
    return _.map(comments || [], comment => new CommentDto(comment));
  }

}
