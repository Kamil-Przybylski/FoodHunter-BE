import { Comments } from './../entities/comment.entity';
import { IsOptional, IsString, MaxLength, IsInt } from "class-validator";
import { UserDto } from 'src/auth/models/auth.models';

export class CreateCommentDto {

  @IsOptional()
  @IsString()
  @MaxLength(255)
  comment: string;

  @IsInt()
  foodId: number;
  
}

export class CommentDto { // FRONT-END DTO
  id: number;
  comment: string;
  createDate: string;
  foodId: number;

  user: UserDto;

  constructor(comment: Comments) {
    this.id = comment.id;
    this.comment = comment.comment;
    this.createDate = comment.createDate;
    this.foodId = comment.foodId;
    
    this.user = new UserDto(comment.user);
  }
}

export class ShortCommentDto {
  totalItems: number;
  isMyComment: boolean;

  constructor(comments: Comments[], userId: number) {
    this.totalItems = (comments || []).length;
    this.isMyComment = !!(comments || []).find(com => com.userId === userId);
  }
}