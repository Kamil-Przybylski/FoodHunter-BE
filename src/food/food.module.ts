import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodRepository } from './entites/food.repository';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodRepository]),
    AuthModule
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
