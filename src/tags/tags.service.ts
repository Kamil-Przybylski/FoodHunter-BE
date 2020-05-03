import { TagDto, CreateTagDto, AddFoodToTagDto } from './models/tag.models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagRepository } from './entities/tag.repository';
import { TagFoodRelationRepository } from './entities/tag-food-relation.repository';
import { User } from 'src/auth/entities/user.entity';
import { TagFoodRelation } from './entities/tag-food-relation.entity';

@Injectable()
export class TagsService {

  constructor(
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
    @InjectRepository(TagFoodRelationRepository)
    private tagFoodRelationRepository: TagFoodRelationRepository,
  ) { }

  async getAllTags(user: User): Promise<TagDto[]> {
    const tags = await this.tagRepository.getAll();
    return tags.map(tag => new TagDto(tag))
  }

  async createTag(createTagDto: CreateTagDto, user: User): Promise<TagDto> {
    const tag = await this.tagRepository.createOne(createTagDto, user);
    return new TagDto(tag);
  }


  async getTagsForFood(foodId: number, user: User): Promise<TagDto[]> {
    const tagFoodRelations = await this.tagFoodRelationRepository.getAllForFood(foodId);
    return tagFoodRelations.map(item => new TagDto(item.tag));
  }

  async addFoodToTag(addFoodToTagDto: AddFoodToTagDto, user: User): Promise<TagFoodRelation> {
    return this.tagFoodRelationRepository.createOne(addFoodToTagDto, user);
  }
}
