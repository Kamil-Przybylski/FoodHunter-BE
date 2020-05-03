import { Controller, UseGuards, Get, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, RestaurantDto } from './models/restaurant.models';

@Controller('restaurant')
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
    @Body(ValidationPipe) createRestaurantDto: CreateRestaurantDto,
    @GetUser() user: User
  ): Promise<RestaurantDto> {
    return this.restaurantService.createRestaurants(createRestaurantDto, user);
  }

}
