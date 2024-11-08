import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'prisma/prisma.service';
import { USERS_MESSAGES } from 'src/constants/messages';
import { nameTokenError, TokenPayload } from 'src/constants/token';

@Injectable()
export class JwtRefreshAuthGuard
  extends AuthGuard('jwt-refresh')
  implements CanActivate
{
  constructor(private jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const { refresh_token } = context.switchToRpc().getData();
    if (!refresh_token) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          refresh_token: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    try {
      const verifyToken: TokenPayload = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      context.switchToRpc().getData().decodeRefreshToken = verifyToken;
      return true;
    } catch (error) {
      if (error.name === nameTokenError.TokenExpiredError) {
        throw new RpcException({
          message: USERS_MESSAGES.TOKEN_EXPIRED_ERROR,
          status: HttpStatus.UNAUTHORIZED,
        });
      }
      if (error.name === nameTokenError.JsonWebTokenError) {
        throw new RpcException({
          message: USERS_MESSAGES.TOKEN_INVALID,
          status: HttpStatus.UNAUTHORIZED,
        });
      }
    }
  }
}
