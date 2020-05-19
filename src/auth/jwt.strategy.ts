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
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    @InjectRepository(UserRepository)
    private UserRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.UserRepository.findOne({ username }, {loadEagerRelations: false});

    if (!user) throw new UnauthorizedException();
    return user;
  }
}