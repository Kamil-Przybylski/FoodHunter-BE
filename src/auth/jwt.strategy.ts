import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as config from 'config';
import { UserRepository } from './entities/user.repository';
import { JwtPayload } from './models/jwt.models';
import { User } from './entities/user.entity';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret || 'test',
    });

    if (!(process.env.JWT_SECRET || jwtConfig.secret))
      console.warn('ERROR: There is a problem with jwt secret string! Secret key not found...');
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepository.getUserData(username);

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
