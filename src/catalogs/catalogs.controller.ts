import { FoodDto } from './../food/models/food.models';
import { Controller, Get, UseGuards, Post, Body, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { CreateCatalogDto, CatalogDto } from './models/catalogs.models';
import { UrlPathsEnum } from 'src/app.config';

@Controller(`${UrlPathsEnum.CATALOGS}`)
@UseGuards(AuthGuard())
export class CatalogsController {

  constructor(private readonly catalogsService: CatalogsService) { }

  @Get()
  getCatalogs(
    @GetUser() user: User
  ): Promise<CatalogDto[]> {
    return this.catalogsService.getCatalogs(user);
  }

  @Post()
  @UseGuards(AuthGuard())
  createCatalog(
    @Body(ValidationPipe) createCatalogDto: CreateCatalogDto,
    @GetUser() user: User
  ): Promise<CatalogDto> {
    return this.catalogsService.createCatalog(createCatalogDto, user);
  }

  // @Get(`:${UrlPathsEnum.ID}`)
  // getFoodForCatalog(
  //   @GetUser() user: User,
  //   @Param(UrlPathsEnum.ID, ParseIntPipe) catalogId: number 
  // ): Promise<FoodDto[]> {
  //   return this.catalogsService.getFoodForCatalog(catalogId, user);
  // }

  // @Post(`:${UrlPathsEnum.ID}/${UrlPathsEnum.ADD_FOOD}`)
  // @UseGuards(AuthGuard())
  // addFoodToCatalog(
  //   @Body(ValidationPipe) addFoodToCatalogDto: AddFoodToCatalogDto,
  //   @GetUser() user: User,
  //   @Param(UrlPathsEnum.ID, ParseIntPipe) catalogId: number 
  // ): Promise<CatalogFoodRelation> {
  //   return this.catalogsService.addFoodToCatalog(addFoodToCatalogDto, catalogId, user);
  // }

}
