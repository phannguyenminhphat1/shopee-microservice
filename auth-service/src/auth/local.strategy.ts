import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { users } from '@prisma/client';
import { USERS_MESSAGES } from 'src/constants/messages';
import { Payload } from '@nestjs/microservices';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
    });
  }

  async validate(payload: any): Promise<users> {
    const { username, password } = payload;
    const user = await this.authService.validateUser({
      username,
      password,
    });
    if (!user) {
      throw new UnauthorizedException({
        message: USERS_MESSAGES.LOGIN_FAIL,
      });
    }
    return user;
  }
}
