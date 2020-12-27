import { Controller, Get, Post, Body, ValidationPipe, UseGuards, UseInterceptors, UploadedFile, Query, Param } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { FoodService } from './food.service';
import { FoodDto, CreateFoodDto, UnparsedCreateFoodDto } from './models/food.models';
import { User } from 'src/auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateRestaurantDto } from 'src/restaurant/models/restaurant.models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileUtil, PaginatorUtil } from 'src/utils';
import { FilePathsEnum, PAGINATOR_OPTIONS, UrlPathsEnum } from 'src/app.config';

@Controller(UrlPathsEnum.FOOD)
@UseGuards(AuthGuard())
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  getFoods(@Query(PAGINATOR_OPTIONS.PAGE) page: string, @GetUser() user: User): Promise<Pagination<FoodDto>> {
    const paginationOptions = PaginatorUtil.getPageOptionsForInfiniteScroll(page);
    return this.foodService.getFoods(paginationOptions, page, user);
  }

  @Get(`:${UrlPathsEnum.ID}`)
  getFood(@Param(UrlPathsEnum.ID) foodId: number, @GetUser() user: User): Promise<FoodDto> {
    return this.foodService.getFood(foodId, user);
  }

  @Get(`${UrlPathsEnum.USER}/:${UrlPathsEnum.ID}`)
  getUserFoods(
    @Param(UrlPathsEnum.ID) userId: string,
    @Query(PAGINATOR_OPTIONS.PAGE) page: string,
    @GetUser() user: User,
  ): Promise<Pagination<FoodDto>> {
    const paginationOptions = PaginatorUtil.getPageOptionsForInfiniteScroll(page);
    return this.foodService.getUserFoods(+userId, page, paginationOptions, user);
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
