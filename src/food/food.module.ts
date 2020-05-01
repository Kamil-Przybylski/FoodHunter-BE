import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodRepository } from './entites/food.repository';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodRepository]),
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
