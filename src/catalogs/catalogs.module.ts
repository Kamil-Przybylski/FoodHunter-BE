import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogRepository } from './entities/catalog.repository';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './catalogs.service';
import { CatalogFoodRelationRepository } from './entities/catalog-food-relation.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CatalogRepository,
      CatalogFoodRelationRepository
    ]),
    AuthModule
  ],
  controllers: [CatalogsController],
  providers: [CatalogsService],
})
export class CatalogsModule {}
