import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { FoodService } from './food.service';
import { FoodDto, CreateFoodDto, UnparsedCreateFoodDto } from './models/food.models';
import { User } from 'src/auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, editFileName } from 'src/file.utils';
import { CreateRestaurantDto } from 'src/restaurant/models/restaurant.models';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Controller('food')
@UseGuards(AuthGuard())
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  getFoods(@Query('page') page: number = 1, @GetUser() user: User): Promise<Pagination<FoodDto>> {
    const paginationOptions: IPaginationOptions = {page: +page, limit: 2};
    return this.foodService.getFoods(paginationOptions, user);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/foods',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  createFood(
    @Body(ValidationPipe)
    createFoodDto: UnparsedCreateFoodDto,
    @UploadedFile() photo: any,
    @GetUser() user: User,
  ): Promise<FoodDto> {
    return this.foodService.createFood(
      new CreateFoodDto(createFoodDto, photo.filename, 'uploads/foods'),
      new CreateRestaurantDto(createFoodDto),
      user,
    );
  }
}
