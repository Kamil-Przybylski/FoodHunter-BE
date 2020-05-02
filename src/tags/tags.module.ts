import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from './entities/tag.repository';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagRepository]),
    AuthModule
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
