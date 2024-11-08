import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { USERS_MESSAGES } from 'src/constants/messages';
import { nameTokenError, TokenPayload } from 'src/constants/token';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const { access_token } = context.switchToRpc().getData();
    if (!access_token || !access_token.startsWith('Bearer ')) {
      throw new RpcException({
        message: USERS_MESSAGES.TOKEN_INVALID,
        status: HttpStatus.UNAUTHORIZED,
      });
    }
    const getToken = access_token.split(' ')[1];
    try {
      const verifyToken: TokenPayload = this.jwtService.verify(getToken, {
        secret: process.env.JWT_SECRET,
      });
      context.switchToRpc().getData().decodeAccessToken = verifyToken;
      return true;
    } catch (error) {
      if (error.name === nameTokenError.TokenExpiredError) {
        throw new RpcException({
          message: USERS_MESSAGES.TOKEN_EXPIRED_ERROR,
          name: error.name,
          status: HttpStatus.UNAUTHORIZED,
        });
      }
      if (error.name === nameTokenError.JsonWebTokenError) {
        throw new RpcException({
          message: USERS_MESSAGES.TOKEN_INVALID,
          name: error.name,
          status: HttpStatus.UNAUTHORIZED,
        });
      }
      throw error;
    }
  }
}
