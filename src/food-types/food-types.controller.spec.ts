import { Test, TestingModule } from '@nestjs/testing';
import { FoodTypesController } from './food-types.controller';

describe('FoodTypes Controller', () => {
  let controller: FoodTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodTypesController],
    }).compile();

    controller = module.get<FoodTypesController>(FoodTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
