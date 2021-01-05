import { Module } from '@nestjs/common';
import { FoodTypesController } from './food-types.controller';
import { FoodTypesService } from './food-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodTypeRepository } from './entities/food-type.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FoodTypesController],
  providers: [FoodTypesService],
  imports: [
    TypeOrmModule.forFeature([FoodTypeRepository]),
    AuthModule
  ],
})
export class FoodTypesModule {}
