import { Comments } from './../entities/comment.entity';
import { IsOptional, IsString, MaxLength, IsInt } from "class-validator";
import _ = require('lodash');
import { UserShortDto } from '../../auth/models/auth.models';

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

  userShort: UserShortDto;

  constructor(comment: Comments) {
    this.id = comment.id;
    this.comment = comment.comment;
    this.createDate = comment.createDate;
    this.foodId = comment.foodId;
    
    this.userShort = new UserShortDto(comment.user);
  }
}

export class CommentInfoDto {
  totalItems: number;
  isMyComment: boolean;

  constructor(comments: Comments[], userId: number) {
    this.totalItems = (comments || []).length;
    this.isMyComment = !!_.find(comments || [], com => com.userId === userId);
  }
}