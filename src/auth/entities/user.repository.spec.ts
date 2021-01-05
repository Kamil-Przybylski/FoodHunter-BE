import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import { AuthSingupDto, UserUpdateInfoDto, UserUpdatePhotoDto } from '../models/auth.models';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

const mockCredentialsDto = new AuthSingupDto();
mockCredentialsDto.username = 'TestUsername';
mockCredentialsDto.email = 'TestEmail';
mockCredentialsDto.password = 'TestPassword';

const mockUserUpdateInfoDto = new UserUpdateInfoDto();
mockUserUpdateInfoDto.id = 1;
mockUserUpdateInfoDto.about = 'TestAbout';

const mockUserUpdatePhotoDto = new UserUpdatePhotoDto({ id: '1' }, 'TestPath', 'TestDest');

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.resolve<UserRepository>(UserRepository);
  });

  // Auth

  describe('getUserData', () => {
    const getOne = jest.fn();
    const where = jest.fn();
    let user: User;

    beforeEach(() => {
      user = new User();

      userRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: where,
        loadRelationCountAndMap: jest.fn(),
        getOne: getOne,
      });
    });

    it('return user as username exsist', async () => {
      getOne.mockResolvedValue(user);

      const result = await userRepository.getUserData('userName');
      expect(where).toHaveBeenCalledWith('user.username = :username', { username: 'userName' });
      expect(getOne).toHaveBeenCalled();
      expect(result).not.toBeNull();
    });

    it('return user as email exsist', async () => {
      getOne.mockResolvedValue(user);

      const result = await userRepository.getUserData('userEmail', true);
      expect(where).toHaveBeenCalledWith('user.email = :email', { email: 'userEmail' });
      expect(getOne).toHaveBeenCalled();
      expect(result).not.toBeNull();
    });

    it('return null as credentials are wrong', async () => {
      getOne.mockResolvedValue(null);

      const result = await userRepository.getUserData('userName');
      expect(result).toBeNull();
    });
  });

  describe('signUp', () => {
    let save: jest.Mock;
    let bcryptHashMock: jest.SpyInstance<Promise<string>>;
    let bcryptSaltMock: jest.SpyInstance<Promise<string>>;

    beforeEach(() => {
      save = jest.fn();
      bcryptHashMock = jest.spyOn(bcrypt, 'hash');
      bcryptSaltMock = jest.spyOn(bcrypt, 'genSalt');
      userRepository.create = jest.fn().mockReturnValue({ save, salt: 'testSalt' });
    });

    afterEach(() => bcryptHashMock.mockRestore());

    it('calls bcrypt.hash to generate a hash', async () => {
      bcryptHashMock.mockResolvedValue('testHash');
      bcryptSaltMock.mockResolvedValue('testSalt');

      expect(bcrypt.hash).not.toHaveBeenCalled();

      await userRepository.signUp(mockCredentialsDto);
      expect(bcrypt.hash).toHaveBeenCalledWith('TestPassword', 'testSalt');
    });

    it('successfully signs up the user', async () => {
      bcryptHashMock.mockResolvedValue('testHash');
      save.mockResolvedValue(undefined);

      await userRepository.signUp(mockCredentialsDto);
      expect(save).toHaveBeenCalled();
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws a conflict exception as username already exists', () => {
      bcryptHashMock.mockResolvedValue('testHash');
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
    });

    it('throws a conflict exception as save have been failed', () => {
      bcryptHashMock.mockResolvedValue('testHash');
      save.mockRejectedValue({ code: '1' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validateUserPassword', () => {
    let user: User;
    const getOne = jest.fn();

    beforeEach(() => {
      user = new User();
      user.username = 'TestUsername';
      user.validatePassword = jest.fn();

      userRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn(),
        loadRelationCountAndMap: jest.fn(),
        getOne: getOne,
      });
    });

    it('returns the username as validation is successful', async () => {
      getOne.mockResolvedValue(user);
      (user.validatePassword as jest.Mock).mockResolvedValue(true);

      const result = await userRepository.validatePasswordAndReturnUser(mockCredentialsDto);
      expect(result).not.toBeNull();
    });

    it('returns null as user cannot be found', async () => {
      getOne.mockResolvedValue(null);

      const result = await userRepository.validatePasswordAndReturnUser(mockCredentialsDto);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      getOne.mockResolvedValue(user);
      (user.validatePassword as jest.Mock).mockResolvedValue(false);

      const result = await userRepository.validatePasswordAndReturnUser(mockCredentialsDto);
      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  // User

  describe('getUser', () => {
    let user: User;
    const getOne = jest.fn();
    const where = jest.fn();

    beforeEach(() => {
      user = new User();
      user.id = 1;

      userRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: where,
        loadRelationCountAndMap: jest.fn(),
        getOne: getOne,
      });
    });

    it('returns user by id', async () => {
      getOne.mockResolvedValue(user);

      const result = await userRepository.getUser(1);
      expect(where).toHaveBeenCalledWith('user.id = :id', { id: 1 });
      expect(getOne).toHaveBeenCalled();
      expect(result?.id).toEqual(1);
    });
  });

  describe('updateUser', () => {
    let user: User;
    const save = jest.fn();

    beforeEach(() => {
      user = new User();
      user.save = save;
      userRepository.getUserData = jest.fn();
    });

    // afterEach(() => save.mockReset());

    it('update user by UpdateInfoDto', async () => {
      save.mockResolvedValue(undefined);
      (userRepository.getUserData as jest.Mock).mockResolvedValue(user);

      const result = await userRepository.updateUser(mockUserUpdateInfoDto, user);
      expect(userRepository.updateUser(mockUserUpdateInfoDto, user)).resolves.not.toThrow();
      expect(save).toHaveBeenCalled();
      expect(result.about).toEqual(mockUserUpdateInfoDto.about);
      expect(result.photoPath).toBeUndefined();
    });

    it('update user by UpdatePhotoDto', async () => {
      save.mockResolvedValue(undefined);
      (userRepository.getUserData as jest.Mock).mockResolvedValue(user);

      const result = await userRepository.updateUser(mockUserUpdatePhotoDto, user);
      expect(userRepository.updateUser(mockUserUpdateInfoDto, user)).resolves.not.toThrow();
      expect(result.photoPath).toEqual(mockUserUpdatePhotoDto.photoPath);
      expect(result.about).toBeUndefined();
    });

    it('throw error as save failed', () => {
      save.mockRejectedValue({ message: 'error' });
      (userRepository.getUserData as jest.Mock).mockResolvedValue(user);

      expect(userRepository.updateUser(mockUserUpdateInfoDto, user)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('addUserFollower', () => {
    let user: User;
    let follower: User;
    let fns: { where: jest.Mock; getMany: jest.Mock; getOne: jest.Mock };
    let save: jest.Mock;

    beforeEach(() => {
      save = jest.fn();

      user = new User();
      user.id = 1;
      user.followerIds = [3];
      user.save = save;

      follower = new User();
      follower.id = 2;
      follower.followerIds = [4];
      follower.save = save;

      fns = { where: jest.fn(), getMany: jest.fn(), getOne: jest.fn() };
      userRepository.createQueryBuilder = jest.fn().mockReturnValue(fns);
    });

    it('add new folower to each others', async () => {
      fns.getOne.mockResolvedValue(follower);
      fns.getMany.mockResolvedValue([]);
      fns.where.mockReturnValue(fns);

      save.mockResolvedValue(undefined);

      await userRepository.addUserFollower(2, user);

      expect(fns.where).toHaveBeenNthCalledWith(1, 'user.id = :id', { id: 2 });
      expect(fns.where).toHaveBeenNthCalledWith(2, 'user.id IN (:...ids)', { ids: [4, 1] });
      expect(fns.where).toHaveBeenNthCalledWith(3, 'user.id IN (:...ids)', { ids: [3, 2] });

      expect(user.save).toHaveBeenCalled();
      expect(follower.save).toHaveBeenCalled();
      expect(userRepository.addUserFollower(2, user)).resolves.not.toThrow();
    });

    it('throw error as one from saves failed', async () => {
      fns.getOne.mockResolvedValue(follower);
      fns.where.mockReturnValue(fns);
      save.mockRejectedValue({ message: 'testError' });

      expect(userRepository.addUserFollower(2, user)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('removeUserFollower', () => {
    let user: User;
    let follower: User;
    let fns: { where: jest.Mock; leftJoinAndSelect: jest.Mock; getOne: jest.Mock };
    let save: jest.Mock;

    beforeEach(() => {
      save = jest.fn();

      user = new User();
      user.id = 1;
      user.followerIds = [3];
      user.save = save;

      follower = new User();
      follower.id = 2;
      follower.followerIds = [4];
      follower.save = save;

      fns = { where: jest.fn(), leftJoinAndSelect: jest.fn(), getOne: jest.fn() };
      userRepository.createQueryBuilder = jest.fn().mockReturnValue(fns);
    });

    it('remove folower from each others', async () => {
      fns.getOne.mockResolvedValueOnce(user);
      fns.getOne.mockResolvedValue(follower);

      fns.where.mockReturnValue(fns);
      fns.leftJoinAndSelect.mockReturnValue(fns);

      save.mockResolvedValue(undefined);

      await userRepository.removeUserFollower(2, user);

      expect(fns.where).toHaveBeenNthCalledWith(1, 'user.id = :id', { id: 1 });
      expect(fns.where).toHaveBeenNthCalledWith(2, 'user.id = :id', { id: 2 });

      expect(user.save).toHaveBeenCalled();
      expect(follower.save).toHaveBeenCalled();
      expect(userRepository.removeUserFollower(2, user)).resolves.not.toThrow();
    });

    it('throw error as one from removes failed', async () => {
      fns.getOne.mockResolvedValueOnce(user);
      fns.getOne.mockResolvedValue(follower);

      fns.where.mockReturnValue(fns);
      fns.leftJoinAndSelect.mockReturnValue(fns);

      save.mockRejectedValue({message: 'testError'});

      expect(userRepository.removeUserFollower(2, user)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getUserFollowers', () => {
    let user: User;
    let fns: { where: jest.Mock; leftJoinAndSelect: jest.Mock; getOne: jest.Mock };

    beforeEach(() => {
      user = new User();
      user.id = 1;

      fns = { where: jest.fn(), leftJoinAndSelect: jest.fn(), getOne: jest.fn() };
      userRepository.createQueryBuilder = jest.fn().mockReturnValue(fns);
    });

    it('should return user followers', async () => {
      fns.getOne.mockResolvedValue(user);

      const result = await userRepository.getUserFollowers(1);
      expect(fns.where).toHaveBeenCalledWith('user.id = :id', { id: 1 });
      expect(fns.getOne).toHaveBeenCalled();
      expect(result?.id).toEqual(1);
    })
  });

  describe('getAllNotFollowed', () => {
    let user: User;
    let fns: { where: jest.Mock; getMany: jest.Mock };

    beforeEach(() => {
      user = new User();
      user.id = 1;
      user.followerIds = [2, 3];

      fns = { where: jest.fn(), getMany: jest.fn() };
      userRepository.createQueryBuilder = jest.fn().mockReturnValue(fns);
    });

    it('should return all followers whos not followed', async () => {
      fns.getMany.mockResolvedValue([]);

      const result = await userRepository.getAllNotFollowed(user);
      expect(fns.where).toHaveBeenCalledWith('user.id NOT IN (:...ids)', { ids: [2, 3, 1] });
      expect(fns.getMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    })
  });

});
