import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { UserRepository } from '../entities/user.repository';
import { AuthSingInDto, UserAuthDto, UserUpdateInfoDto, UserUpdatePhotoDto } from '../models/auth.models';
import { AuthService } from './auth.service';

const mockUserRepository = () => ({
  validatePasswordAndReturnUser: jest.fn(),
  updateUser: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

const mockAuthSingInDto = new AuthSingInDto();
mockAuthSingInDto.email = 'testEmail';
mockAuthSingInDto.password = 'testPassword';

const mockUserUpdateInfoDto = new UserUpdateInfoDto();
mockUserUpdateInfoDto.id = 1;
const mockUserUserUpdatePhotoDto = new UserUpdatePhotoDto({ id: '1' }, 'testPath', 'testDest');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('singIn', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.photoPath = 'testPath';
    });

    it('should return token and UserAuthDto as credentials are correct', async () => {
      (userRepository.validatePasswordAndReturnUser as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue('testToken');

      const result = await service.singIn(mockAuthSingInDto);
      expect(service.singIn(mockAuthSingInDto)).resolves.not.toThrow();
      expect(userRepository.validatePasswordAndReturnUser).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: 'testToken', user: new UserAuthDto(user) });
    });

    it('throw error when credentials are wrong', async () => {
      (userRepository.validatePasswordAndReturnUser as jest.Mock).mockResolvedValue(null);
      expect(service.singIn(mockAuthSingInDto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.validatePasswordAndReturnUser).toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.id = 1;
    });

    it('should update user from UserUpdateInfoDto', async () => {
      (userRepository.updateUser as jest.Mock).mockResolvedValue(user);

      const result = await service.updateUser(mockUserUpdateInfoDto, user);
      expect(service.updateUser(mockUserUpdateInfoDto, user)).resolves.not.toThrow();
      expect(userRepository.updateUser).toHaveBeenCalled();
      expect(result).toEqual(new UserAuthDto(user));
    });

    it('should update user from mockUserUserUpdatePhotoDto', async () => {
      (userRepository.updateUser as jest.Mock).mockResolvedValue(user);

      const result = await service.updateUser(mockUserUserUpdatePhotoDto, user);
      expect(service.updateUser(mockUserUpdateInfoDto, user)).resolves.not.toThrow();
      expect(userRepository.updateUser).toHaveBeenCalled();
      expect(result).toEqual(new UserAuthDto(user));
    });

    it('throw an error when updateUserId is not equal to authUserId', async () => {
      mockUserUpdateInfoDto.id = 2;
      expect(service.updateUser(mockUserUpdateInfoDto, user)).rejects.toThrow(NotFoundException);
    });
  });
});
