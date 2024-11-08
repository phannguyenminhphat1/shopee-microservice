import { Controller, Get, Headers } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get-me')
  async getMe(@Headers('authorization') authHeader: string) {
    return await this.userService.getMe(authHeader);
  }
}
