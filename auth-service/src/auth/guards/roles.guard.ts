import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'prisma/prisma.service';
import { USERS_MESSAGES } from 'src/constants/messages';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const { roles, user_id } = context.switchToRpc().getData();
    const user = await this.prismaService.users.findUnique({
      where: { user_id },
    });
    if (!user) {
      throw new RpcException({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HttpStatus.UNAUTHORIZED,
      });
    }
    const isForbidden = roles.includes(user.role);
    if (!isForbidden) {
      throw new RpcException({
        message: USERS_MESSAGES.DO_NOT_HAVE_PERMISSION,
        status: HttpStatus.FORBIDDEN,
      });
    }

    return true;
  }
}
