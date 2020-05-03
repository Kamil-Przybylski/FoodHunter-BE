import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from './entities/tag.repository';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { AuthModule } from 'src/auth/auth.module';
import { TagFoodRelationRepository } from './entities/tag-food-relation.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TagRepository,
      TagFoodRelationRepository
  ]),
    AuthModule
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
