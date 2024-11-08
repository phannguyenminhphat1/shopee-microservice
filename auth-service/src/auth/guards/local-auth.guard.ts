import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { RpcException } from '@nestjs/microservices';
import { USERS_MESSAGES } from 'src/constants/messages';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
  constructor(private authService: AuthService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const { username, password } = context.switchToRpc().getData();
    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: USERS_MESSAGES.LOGIN_FAIL,
      });
    }
    context.switchToRpc().getData().user = user;
    return true;
  }
}
