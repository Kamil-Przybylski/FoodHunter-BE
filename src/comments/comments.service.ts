import { Injectable } from '@nestjs/common';
import { CreateCommentDto, CommentDto } from './models/comment.models';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsRepository } from './entities/comment.repository';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(CommentsRepository)
    private commentsRepository: CommentsRepository
  ) { }
  
  async createComment(createCommentDto: CreateCommentDto, user: User): Promise<CommentDto> {
    const comment = await this.commentsRepository.createOne(createCommentDto, user);
    return new CommentDto(comment);
  }

}
