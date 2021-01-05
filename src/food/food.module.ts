import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FoodRepository } from './entites/food.repository';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodRepository]),
    AuthModule
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
