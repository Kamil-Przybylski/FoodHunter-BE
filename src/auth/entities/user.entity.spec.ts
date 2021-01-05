import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User entity', () => {
  let user: User;
  let bcryptMock: jest.SpyInstance<Promise<string>>;

  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'testSalt';

    bcryptMock = jest.spyOn(bcrypt, 'hash');
  });

  afterEach(() => bcryptMock.mockRestore());

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      bcryptMock.mockReturnValue(new Promise(resolve => resolve('testPassword')));
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      bcryptMock.mockReturnValue(new Promise(resolve => resolve('wrongPassword')));
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.validatePassword('wrongPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
