import { Controller, Get, Post, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { FoodService } from './food.service';
import { FoodDto, CreateFoodDto } from './models/food.models';
import { User } from 'src/auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('food')
@UseGuards(AuthGuard())
export class FoodController {

  constructor(private readonly foodService: FoodService) { }

  @Get()
  getFoods(
    @GetUser() user: User
  ): Promise<FoodDto[]> {
    return this.foodService.getFoods(user);
  }

  @Post()
  @UseGuards(AuthGuard())
  createFood(
    @Body(ValidationPipe) createFoodDto: CreateFoodDto,
    @GetUser() user: User
  ): Promise<FoodDto> {
    return this.foodService.createFood(createFoodDto, user);
  }
  
}
