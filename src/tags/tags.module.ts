import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TagRepository } from './entities/tag.repository';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagRepository]), AuthModule],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
