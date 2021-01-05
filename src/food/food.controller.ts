import { Controller, Get, Post, Body, ValidationPipe, UseGuards, UseInterceptors, UploadedFile, Query, Param, Put } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodDto, CreateFoodDto, UnparsedCreateFoodDto, SetLikeForFoodDto } from './models/food.models';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { FilePathsEnum, PAGINATOR_OPTIONS, UrlPathsEnum } from '../app.config';
import { FileUtil, PaginatorUtil } from '../utils';
import { CreateRestaurantDto } from '../restaurant/models/restaurant.models';

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

  @Put(`${UrlPathsEnum.LIKES}`)
  setLikeForFood(
    @Body(ValidationPipe)
    setLikeForFoodDto: SetLikeForFoodDto,
    @GetUser() user: User,
  ): Promise<FoodDto> {
    return this.foodService.setLikeForFood(setLikeForFoodDto.foodId, user);
  }
}
