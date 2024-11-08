import {
  Body,
  Controller,
  Headers,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ERROR } from 'src/constants/error';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(ERROR.UNPROCESSABLE_ENTITY_EXCEPTION)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UsePipes(ERROR.UNPROCESSABLE_ENTITY_EXCEPTION)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('logout')
  async logout(
    @Headers('authorization') authHeader: string,
    @Body('refresh_token') refresh_token: string,
  ) {
    return await this.authService.logout(authHeader, refresh_token);
  }

  @Post('refresh-token')
  async refreshToken(@Body('refresh_token') refresh_token: string) {
    return await this.authService.refreshToken(refresh_token);
  }
}
