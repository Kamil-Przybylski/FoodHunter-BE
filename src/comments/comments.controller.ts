import { Controller, UseGuards, Post, Body, ValidationPipe, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto, CommentDto } from './models/comment.models';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { UrlPathsEnum } from 'src/app.config';

@Controller(UrlPathsEnum.COMMENTS)
@UseGuards(AuthGuard())
export class CommentsController {

  constructor(private readonly commentService: CommentsService) { }

  @Get(`${UrlPathsEnum.FOOD}/:${UrlPathsEnum.ID}`)
  getCommentsByFoodId(
    @Param(UrlPathsEnum.ID) foodId: string,
    @GetUser() user: User
  ): Promise<CommentDto[]> {
    return this.commentService.getCommentsByFoodId(+foodId, user);
  }

  @Post()
  createComment(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @GetUser() user: User
  ): Promise<CommentDto[]> {
    return this.commentService.createComment(createCommentDto, user);
  }

}
