import { Body, Controller, Get, Post, Put, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/utils/decorators/user.decorator';
import { users } from '@prisma/client';
import { UpdateMeDto } from './dto/update-me.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get-me')
  async getMe(@Payload() payload: { user_id: number }) {
    return await this.userService.getMe(payload);
  }

  // @Put('update-me')
  // async updateMe(@User() user: users, @Body() updateMeDto: UpdateMeDto) {
  //   return await this.userService.updateMe(user, updateMeDto);
  // }

  // @Post('upload-avatar')
  // async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
  //   return await this.userService.uploadAvatar(file);
  // }

  // @Put('change-password')
  // async changePassword(
  //   @User() user: users,
  //   @Body() changePasswordDto: ChangePasswordDto,
  // ) {
  //   return await this.userService.changePassword(user, changePasswordDto);
  // }
}
