import { FoodDto } from './../food/models/food.models';
import { Controller, Get, UseGuards, Post, Body, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { CreateCatalogDto, CatalogDto } from './models/catalogs.models';
import { AddFoodToCatalogDto } from './models/catalog-food-relation.models';
import { CatalogFoodRelation } from './entities/catalog-food-relation.entity';
import { Food } from 'src/food/entites/food.entity';

@Controller('catalogs')
@UseGuards(AuthGuard())
export class CatalogsController {

  constructor(private readonly catalogsService: CatalogsService) { }

  @Get()
  getCatalogs(
    @GetUser() user: User
  ): Promise<CatalogDto[]> {
    return this.catalogsService.getCatalogs(user);
  }

  @Get(':id')
  getFoodForCatalog(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) catalogId: number 
  ): Promise<FoodDto[]> {
    return this.catalogsService.getFoodForCatalog(catalogId, user);
  }

  @Post()
  @UseGuards(AuthGuard())
  createCatalog(
    @Body(ValidationPipe) createCatalogDto: CreateCatalogDto,
    @GetUser() user: User
  ): Promise<CatalogDto> {
    return this.catalogsService.createCatalog(createCatalogDto, user);
  }

  @Post(':id/add-food')
  @UseGuards(AuthGuard())
  addFoodToCatalog(
    @Body(ValidationPipe) addFoodToCatalogDto: AddFoodToCatalogDto,
    @GetUser() user: User,
    @Param('id', ParseIntPipe) catalogId: number 
  ): Promise<CatalogFoodRelation> {
    return this.catalogsService.addFoodToCatalog(addFoodToCatalogDto, catalogId, user);
  }

}
