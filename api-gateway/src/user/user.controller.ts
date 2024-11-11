import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadOptions } from 'src/utils/uploads/upload';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get-me')
  async getMe(@Headers('authorization') authHeader: string) {
    return await this.userService.getMe(authHeader);
  }

  @Put('update-me')
  async updateMe(
    @Headers('authorization') authHeader: string,
    @Body() updateMeDto: UpdateMeDto,
  ) {
    return await this.userService.updateMe(authHeader, updateMeDto);
  }

  @Put('change-password')
  async changePassword(
    @Headers('authorization') authHeader: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(authHeader, changePasswordDto);
  }

  @UseInterceptors(FileInterceptor('image', uploadOptions))
  @Post('upload-avatar')
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return await this.userService.uploadAvatar(file);
  }
}
