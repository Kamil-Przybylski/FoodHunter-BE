import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { JwtStrategy } from './jwt.strategy';

const mockUserRepository = () => ({
  getUserData: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtStrategy, { provide: UserRepository, useFactory: mockUserRepository }],
    }).compile();

    jwtStrategy = await moduleRef.resolve<JwtStrategy>(JwtStrategy);
    userRepository = await moduleRef.resolve<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'TestUser';

      (userRepository.getUserData as jest.Mock).mockResolvedValue(user);

      const result = await jwtStrategy.validate({ username: 'TestUser' });

      expect(userRepository.getUserData).toHaveBeenCalledWith('TestUser');
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', () => {
      (userRepository.getUserData as jest.Mock).mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: 'TestUser' })).rejects.toThrow(UnauthorizedException);
    });
  });
});
