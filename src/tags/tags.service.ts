import { TagDto, CreateTagDto, AddFoodToTagDto } from './models/tag.models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagRepository } from './entities/tag.repository';
import _ = require('lodash');
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TagsService {

  constructor(
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
  ) { }

  async getAllTags(user: User): Promise<TagDto[]> {
    const tags = await this.tagRepository.getAll();
    return _.map(tags || [], tag => new TagDto(tag));
  }

  async createTag(createTagDto: CreateTagDto, user: User): Promise<TagDto> {
    const tag = await this.tagRepository.createOne(createTagDto, user);
    return new TagDto(tag);
  }


  // async getTagsForFood(foodId: number, user: User): Promise<TagDto[]> {
  //   const tagFoodRelations = await this.tagFoodRelationRepository.getAllForFood(foodId);
  //   return tagFoodRelations.map(item => new TagDto(item.tag));
  // }

  // async addFoodToTag(addFoodToTagDto: AddFoodToTagDto, user: User): Promise<TagFoodRelation> {
  //   return this.tagFoodRelationRepository.createOne(addFoodToTagDto, user);
  // }
}
