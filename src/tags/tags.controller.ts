import { Controller, UseGuards, Get, Post, Body, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from './tags.service';
import { TagDto } from './models/tag.models';
import { CreateTagDto } from './models/tag.models';
import { UrlPathsEnum } from '../app.config';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller(UrlPathsEnum.TAGS)
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

  // @Post(`/${UrlPathsEnum.ADD_FOOD}`)
  // @UseGuards(AuthGuard())
  // addFoodToCatalog(
  //   @Body(ValidationPipe) addFoodToTagDto: AddFoodToTagDto,
  //   @GetUser() user: User,
  // ): Promise<TagFoodRelation> {
  //   return this.tagsService.addFoodToTag(addFoodToTagDto, user);
  // }

}
