import { Comments } from './../entities/comment.entity';
import { IsOptional, IsString, MaxLength, IsInt } from "class-validator";

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

  userId: number;
  foodId: number;

  constructor(comment: Comments) {
    this.id = comment.id;
    this.comment = comment.comment;
    this.createDate = comment.createDate;
    
    this.userId = comment.userId;
    this.foodId = comment.foodId;
  }
}