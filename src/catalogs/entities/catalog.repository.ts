import { Repository, EntityRepository } from 'typeorm';
import { Catalog } from './catalog.entity';
import { CreateCatalogDto } from '../models/catalogs.models';
import { InternalServerErrorException } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';

@EntityRepository(Catalog)
export class CatalogRepository extends Repository<Catalog> {

  async getAll() {
    const query = this.createQueryBuilder('catalog');
    return await query.getMany();
  }

  async createOne(createFoodDto: CreateCatalogDto, user: User): Promise<Catalog> {
    const { 
      name, 
      description, 
      isPrivate,
      userId
    } = createFoodDto;

    const catalog = new Catalog();
    catalog.name = name;
    catalog.description = description;
    catalog.isPrivate = isPrivate;
    catalog.createDate = (new Date()).toISOString();

    catalog.userId = userId;

    try {
      await catalog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return catalog;
  }

}