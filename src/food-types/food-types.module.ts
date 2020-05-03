import { Module } from '@nestjs/common';
import { FoodTypesController } from './food-types.controller';
import { FoodTypesService } from './food-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FoodTypeRepository } from './entities/food-type.repository';

@Module({
  controllers: [FoodTypesController],
  providers: [FoodTypesService],
  imports: [
    TypeOrmModule.forFeature([FoodTypeRepository]),
    AuthModule
  ],
})
export class FoodTypesModule {}
