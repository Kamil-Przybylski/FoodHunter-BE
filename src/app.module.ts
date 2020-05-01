import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { AuthModule } from './auth/auth.module';
import { FoodModule } from './food/food.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';

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
