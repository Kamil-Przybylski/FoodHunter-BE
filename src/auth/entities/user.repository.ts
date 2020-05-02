import { Repository, EntityRepository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { AuthSingupDto, AuthSingInDto, UserUpdateInfoDto } from '../models/auth.models';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async singUp(authSingupDto: AuthSingupDto): Promise<void> {
    const { username, email, password } = authSingupDto;

    const user = this.create();
    user.username = username;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.createDate = (new Date()).toISOString();
    
    try {
      await user.save();
    } catch(error) {
      if (error.code === '23505') throw new ConflictException(error && error.detail);
      else throw new InternalServerErrorException(error && error.message);
    }
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(authSingInDto: AuthSingInDto): Promise<User> {
    const { email, password } = authSingInDto;
    const user = await this.findOne({ email });

    if (user && await user.validatePassword(password)) return user;
    else return null; 
  }
 
  async updateUser(userUpdateInfoDto: UserUpdateInfoDto, user: User): Promise<User> {
    if (userUpdateInfoDto.username) user.username = userUpdateInfoDto.username; 
    if (userUpdateInfoDto.birthDate) user.birthDate = userUpdateInfoDto.birthDate; 
    if (userUpdateInfoDto.photoPath) user.photoPath = userUpdateInfoDto.photoPath; 
    if (userUpdateInfoDto.about) user.about = userUpdateInfoDto.about; 

    return await user.save();
  }

  async getAll() {
    const query = this.createQueryBuilder('user');
    return await query.getMany();
  }
}