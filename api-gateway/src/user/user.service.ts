import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import { SuccessResponse } from 'src/constants/response';
import { User } from 'src/constants/types';
import { wrapRequestHandler } from 'src/utils/wrapRequestHandler';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private userService: ClientProxy,
    private authService: AuthService,
  ) {}

  async getMe(authHeader: string) {
    const authInfo = await this.authService.authentication(authHeader);
    const {
      decodeAccessToken: { user_id },
    } = authInfo;
    return await wrapRequestHandler<SuccessResponse<User>>(
      this.userService,
      'get-me',
      {
        user_id,
      },
    );
  }
}
