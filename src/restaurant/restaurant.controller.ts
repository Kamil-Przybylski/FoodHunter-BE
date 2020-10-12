import { Controller, UseGuards, Get, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { RestaurantService } from './restaurant.service';
import { CreateSingleRestaurantDto, RestaurantDto } from './models/restaurant.models';
import { UrlPathsEnum } from 'src/app.config';

@Controller(UrlPathsEnum.RESTAURANT)
@UseGuards(AuthGuard())
export class RestaurantController {

  constructor(private readonly restaurantService: RestaurantService) { }

  @Get()
  getRestaurants(
    @GetUser() user: User
  ): Promise<RestaurantDto[]> {
    return this.restaurantService.getRestaurants(user);
  }

  @Post()
  createRestaurants(
    @Body(ValidationPipe) createRestaurantDto: CreateSingleRestaurantDto,
    @GetUser() user: User
  ): Promise<RestaurantDto> {
    return this.restaurantService.createRestaurants(createRestaurantDto, user);
  }

}
