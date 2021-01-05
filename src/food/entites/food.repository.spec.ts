import { Test } from '@nestjs/testing';
import { FoodRepository } from './food.repository';
import { User } from '../../auth/entities/user.entity';
import { PaginatorUtil } from '../../utils';
import { mocked } from 'ts-jest/utils';

import { paginate } from 'nestjs-typeorm-paginate';
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockImplementation(() => 'pagination return'),
}));

import { Food } from './food.entity';
const saveFoodMocked = jest.fn();
jest.mock('./food.entity', () => ({
  Food: jest.fn().mockImplementation(() => ({
    save: saveFoodMocked,
  })),
}));

import { Restaurant } from '../../restaurant/entities/restaurant.entity';
const saveRestaurantMocked = jest.fn();
jest.mock('../../restaurant/entities/restaurant.entity', () => ({
  Restaurant: jest.fn().mockImplementation(() => ({
    save: saveRestaurantMocked,
  })),
}));

import * as typeorm from 'typeorm';
jest.spyOn(typeorm, 'getConnection');

describe('FoodRepository', () => {
  let foodRepository: FoodRepository;
  const MockedPaginate = mocked(paginate, true);
  const MockedFood = mocked(Food, true);
  const MockedRestaurant = mocked(Restaurant, true);

  let fns = { where: jest.fn(), leftJoinAndSelect: jest.fn(), addSelect: jest.fn(), orderBy: jest.fn(), getOne: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FoodRepository],
    }).compile();

    MockedPaginate.mockClear();
    MockedFood.mockClear();
    MockedRestaurant.mockClear();

    foodRepository = await module.resolve<FoodRepository>(FoodRepository);
    foodRepository.createQueryBuilder = jest.fn().mockReturnValue({
      where: fns.where,
      leftJoinAndSelect: fns.leftJoinAndSelect,
      leftJoin: jest.fn().mockReturnValue({ addSelect: fns.addSelect }),
      orderBy: fns.orderBy,
      getOne: fns.getOne,
    });
  });

  describe('getFoods', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.id = 1;
      user.followerIds = [2, 3];
    });

    it('should return Paginator of foods', async () => {
      const result = await foodRepository.getFoods(PaginatorUtil.getPageOptionsForInfiniteScroll('1'), user);

      expect(fns.where).toHaveBeenCalledWith('food.userId IN (:...ids)', { ids: [2, 3, 1] });
      expect(paginate).toHaveBeenCalled();
      expect(result).toEqual('pagination return');
    });
  });

  describe('getFood', () => {
    let food: Food;

    beforeEach(() => {
      food = new Food();
      food.id = 1;
    });

    it('should return food', async () => {
      fns.getOne.mockResolvedValue(food);
      const result = await foodRepository.getFood(1);

      expect(fns.where).toHaveBeenCalledWith('food.id = :id', { id: 1 });
      expect(fns.getOne).toHaveBeenCalled();
      expect(result?.id).toEqual(1);
    });
  });

  describe('getUserFoods', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.id = 1;
      user.followerIds = [2, 3];
    });

    it('should return Paginator of user foods', async () => {
      const result = await foodRepository.getUserFoods(1, PaginatorUtil.getPageOptionsForInfiniteScroll('1'), user);

      expect(fns.where).toHaveBeenCalledWith('food.userId = :id', { id: 1 });
      expect(paginate).toHaveBeenCalled();
      expect(result).toEqual('pagination return');
    });
  });

  describe('createSingle', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.id = 1;
    });

    it('should create food and restaurant', async () => {
      saveFoodMocked.mockResolvedValue(undefined);
      saveRestaurantMocked.mockResolvedValue(undefined);

      const result = await foodRepository.createSingle({} as any, {} as any, user);
      expect(foodRepository.createSingle({} as any, {} as any, user)).resolves.not.toThrow();
      expect(saveFoodMocked).toHaveBeenCalled();
      expect(saveRestaurantMocked).toHaveBeenCalled();
      expect(result?.userId).toEqual(1);
    });

    it('throw error when save failed', async () => {
      saveRestaurantMocked.mockRejectedValue(undefined);
      expect(foodRepository.createSingle({} as any, {} as any, user)).rejects.toThrow();
    });
  });

  describe('setLikeForFood', () => {
    let user: User;
    let food: Food;

    beforeEach(() => {
      user = new User();
      user.id = 2;
      user.save = jest.fn();
      food = new Food();
      food.id = 1;
      food.save = jest.fn();
      foodRepository.getFood = jest.fn();

      (typeorm.getConnection as jest.Mock).mockReturnValue({
        getRepository: () => ({ createQueryBuilder: foodRepository.createQueryBuilder }),
      });
      fns.getOne.mockResolvedValue(user);
      (foodRepository.getFood as jest.Mock).mockResolvedValue(food);
    });

    it('should add one like and retun food', async () => {
      user.likes = [{id: 3} as any];
      food.likes = [{id: 4} as any];

      const result = await foodRepository.setLikeForFood(1, 2);

      expect(fns.where).toHaveBeenCalledWith('user.id = :id', { id: 2 });
      expect(user.likes.length).toEqual(2);
      expect(food.likes.length).toEqual(2);
      expect(foodRepository.setLikeForFood(1, 2)).resolves.not.toThrow();
      expect(food.save).toHaveBeenCalled();
      expect(user.save).toHaveBeenCalled();
      expect(result?.id).toEqual(1);
    });

    it('should remove one like and retun food', async () => {
      user.likes = [{id: 1} as any];
      food.likes = [{id: 2} as any];

      const result = await foodRepository.setLikeForFood(1, 2);
      expect(user.likes.length).toEqual(0);
      expect(food.likes.length).toEqual(0);
      expect(result?.id).toEqual(1);
    });
  });
});
