import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodModule } from './food/food.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './typeorm.config';
import { FoodTypesModule } from './food-types/food-types.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: '/upload',
      }),
    }),

    AuthModule,
    FoodModule,
    CatalogsModule,
    RestaurantModule,
    CommentsModule,
    TagsModule,
    FoodTypesModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
