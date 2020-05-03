import { Repository, EntityRepository } from 'typeorm';
import { Tag } from './tag.entity';
import { User } from 'src/auth/entities/user.entity';
import { CreateTagDto } from '../models/tag.models';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {

  async getAll() {
    const query = this.createQueryBuilder('tag');
    return await query.getMany();
  }

  async createOne(createTagDto: CreateTagDto, user: User): Promise<Tag> {
    const { name, description } = createTagDto;

    const tag = new Tag();
    tag.name = name;
    tag.description = description;

    try {
      await tag.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return tag;
  }
}