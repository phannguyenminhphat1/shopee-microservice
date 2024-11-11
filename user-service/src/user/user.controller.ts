import { Body, Controller, Get, Post, Put, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
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

  @MessagePattern('update-me')
  async updateMe(
    @Payload() payload: { authInfo: AuthInfo; updateMeDto: UpdateMeDto },
  ) {
    return await this.userService.updateMe(payload);
  }

  @MessagePattern('change-password')
  async changePassword(
    @Payload()
    payload: {
      authInfo: AuthInfo;
      changePasswordDto: ChangePasswordDto;
    },
  ) {
    return await this.userService.changePassword(payload);
  }

  @MessagePattern('upload-avatar')
  async uploadAvatar(
    @Payload()
    payload: {
      result: any;
      input: string;
      output: string;
      file: Express.Multer.File;
    },
  ) {
    return await this.userService.uploadAvatar(payload);
  }
}
