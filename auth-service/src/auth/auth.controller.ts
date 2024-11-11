import { Body, Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { USERS_MESSAGES } from 'src/constants/messages';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthInfo } from 'src/constants/token';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      data: user,
    };
  }

  @UseGuards(LocalAuthGuard)
  @MessagePattern('login')
  async login(@Payload() payload: any) {
    const { accessToken, refreshToken } = await this.authService.login(
      payload.user,
    );
    return {
      message: USERS_MESSAGES.LOGIN_SUCCESSFULLY,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: payload.user,
      },
    };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @UseGuards(JwtAuthGuard)
  @MessagePattern('logout')
  async logout(@Payload() payload: any) {
    return await this.authService.logout(payload);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @MessagePattern('refresh-token')
  async refreshToken(@Payload() payload: any) {
    return await this.authService.refreshToken(payload);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authentication')
  async authentication(
    @Payload()
    payload: AuthInfo,
  ) {
    return payload;
  }

  @UseGuards(RolesGuard)
  @MessagePattern('roles-guard')
  async rolesGuard() {
    return true;
  }

  @MessagePattern('hash-password')
  async hashPassword(@Payload() payload: { new_password: string }) {
    return await this.authService.hashPassword(payload.new_password);
  }
}
