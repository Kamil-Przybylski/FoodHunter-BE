import { Controller, UseGuards, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto, CommentDto } from './models/comment.models';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('comments')
@UseGuards(AuthGuard())
export class CommentsController {

  constructor(private readonly commentService: CommentsService) { }

  @Post()
  @UseGuards(AuthGuard())
  createComment(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @GetUser() user: User
  ): Promise<CommentDto> {
    return this.commentService.createComment(createCommentDto, user);
  }

}
