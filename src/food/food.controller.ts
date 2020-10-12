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
import { CreateRestaurantDto } from 'src/restaurant/models/restaurant.models';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { FileUtil } from 'src/utils';
import { FilePathsEnum, paginatorOptions, UrlPathsEnum } from 'src/app.config';

@Controller(UrlPathsEnum.FOOD)
@UseGuards(AuthGuard())
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  getFoods(@Query(paginatorOptions.PAGE) page: number = 1, @GetUser() user: User): Promise<Pagination<FoodDto>> {
    const paginationOptions: IPaginationOptions = { page: +page, limit: paginatorOptions.food.limits };
    return this.foodService.getFoods(paginationOptions, user);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor(FilePathsEnum.PHOTO, {
      storage: diskStorage({
        destination: `./${FilePathsEnum.FOOD_PATH}`,
        filename: FileUtil.editFileName,
      }),
      fileFilter: FileUtil.imageFileFilter,
    }),
  )
  createFood(
    @Body(ValidationPipe)
    createFoodDto: UnparsedCreateFoodDto,
    @UploadedFile() photo: any,
    @GetUser() user: User,
  ): Promise<FoodDto> {
    return this.foodService.createFood(
      new CreateFoodDto(createFoodDto, photo.filename, `${FilePathsEnum.FOOD_PATH}`),
      new CreateRestaurantDto(createFoodDto),
      user,
    );
  }
}
