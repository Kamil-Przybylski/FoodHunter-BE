import { Controller, Get, Post, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { FoodTypesService } from './food-types.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CreateFoodTypeDto, FoodTypeDto } from './models/food-type.models';
import { AuthGuard } from '@nestjs/passport';
import { UrlPathsEnum } from 'src/app.config';

@Controller(UrlPathsEnum.FOOD_TYPES)
@UseGuards(AuthGuard())
export class FoodTypesController {

  constructor(private readonly foodTypesService: FoodTypesService) { }

  @Get()
  getFoodTypes(
    @GetUser() user: User
  ): Promise<FoodTypeDto[]> {
    return this.foodTypesService.getFoodTypes(user);
  }

  @Post()
  createFoodType(
    @Body(ValidationPipe) createFoodTypeDto: CreateFoodTypeDto,
    @GetUser() user: User
  ): Promise<FoodTypeDto> {
    return this.foodTypesService.createFoodType(createFoodTypeDto, user);
  }

}
