import {
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/constants/types';
import { wrapRequestHandler } from 'src/utils/wrapRequestHandler';
import {
  AuthInfo,
  AuthResponse,
  SuccessResponse,
} from 'src/constants/response';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private authService: ClientProxy) {}

  async login(loginDto: LoginDto) {
    const { password, username } = loginDto;
    const payload = {
      username,
      password,
    };
    return await wrapRequestHandler<SuccessResponse<AuthResponse>>(
      this.authService,
      'login',
      payload,
    );
  }

  async register(registerDto: RegisterDto) {
    return await wrapRequestHandler<SuccessResponse<User>>(
      this.authService,
      'register',
      registerDto,
    );
  }

  async logout(authHeader: string, refresh_token: string) {
    return await wrapRequestHandler<{ message: string }>(
      this.authService,
      'logout',
      { access_token: authHeader, refresh_token },
    );
  }

  async refreshToken(refresh_token: string) {
    return await wrapRequestHandler<{ message: string }>(
      this.authService,
      'logout',
      { refresh_token },
    );
  }

  async authentication(authHeader: string) {
    return await wrapRequestHandler<AuthInfo>(
      this.authService,
      'authentication',
      {
        access_token: authHeader,
      },
    );
  }

  async rolesGuard(roles: string[], user_id: number) {
    try {
      return await lastValueFrom(
        this.authService.send('roles-guard', {
          roles,
          user_id,
        }),
      );
    } catch (error) {
      if (error.status === HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException(error);
      }
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(error);
      }
      if (error.status === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException(error);
      }
    }
  }
}
