import { Test, TestingModule } from '@nestjs/testing';
import { FoodTypesService } from './food-types.service';

describe('FoodTypesService', () => {
  let service: FoodTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodTypesService],
    }).compile();

    service = module.get<FoodTypesService>(FoodTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
