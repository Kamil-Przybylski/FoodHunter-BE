import { Controller, UseGuards, Get, Post, Body, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from './tags.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { TagDto, AddFoodToTagDto } from './models/tag.models';
import { CreateTagDto } from './models/tag.models';
import { TagFoodRelation } from './entities/tag-food-relation.entity';

@Controller('tags')
@UseGuards(AuthGuard())
export class TagsController {

  constructor(private readonly tagsService: TagsService) { }

  @Get()
  getAllTags(
    @GetUser() user: User
  ): Promise<TagDto[]> {
    return this.tagsService.getAllTags(user);
  }

  @Post()
  @UseGuards(AuthGuard())
  createTag(
    @Body(ValidationPipe) createTagDto: CreateTagDto,
    @GetUser() user: User
  ): Promise<TagDto> {
    return this.tagsService.createTag(createTagDto, user);
  }

  @Post('/add-food')
  @UseGuards(AuthGuard())
  addFoodToCatalog(
    @Body(ValidationPipe) addFoodToTagDto: AddFoodToTagDto,
    @GetUser() user: User,
  ): Promise<TagFoodRelation> {
    return this.tagsService.addFoodToTag(addFoodToTagDto, user);
  }

}
