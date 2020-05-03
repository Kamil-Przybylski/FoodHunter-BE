import { EntityRepository, Repository } from "typeorm";
import { TagFoodRelation } from "./tag-food-relation.entity";
import { AddFoodToTagDto } from "../models/tag.models";
import { User } from "src/auth/entities/user.entity";
import { InternalServerErrorException } from "@nestjs/common";

@EntityRepository(TagFoodRelation)
export class TagFoodRelationRepository extends Repository<TagFoodRelation> {

  async getAllForFood(foodId: number): Promise<TagFoodRelation[]> {
    const query = this.createQueryBuilder('tag_food_relation');
    query.where('tag_food_relation.foodId = :foodId', { foodId });
    query.leftJoinAndSelect('tag_food_relation.tag', 'tag');
    const catalogFoodRelation = await query.getMany();

    return catalogFoodRelation;
  }

  async createOne(addFoodToTagDto: AddFoodToTagDto, user: User): Promise<TagFoodRelation> {
    const { 
      tagId,
      foodId 
    } = addFoodToTagDto;

    const tagFoodRelation = new TagFoodRelation();
    tagFoodRelation.tagId = tagId;
    tagFoodRelation.foodId = foodId;

    try {
      await tagFoodRelation.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return tagFoodRelation;
  }

}