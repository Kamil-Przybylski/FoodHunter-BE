import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodModule } from './food/food.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    FoodModule,
    CatalogsModule,
    RestaurantModule,
    CommentsModule,
    TagsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
