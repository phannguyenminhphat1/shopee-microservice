import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import { SuccessResponse } from 'src/constants/response';
import { User } from 'src/constants/types';
import { wrapRequestHandler } from 'src/utils/wrapRequestHandler';
import { UpdateMeDto } from './dto/update-me.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { compressImage } from 'src/utils/compress-img/compress-img';
import { USERS_MESSAGES } from 'src/constants/messages';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private userService: ClientProxy,
    private authService: AuthService,
  ) {}

  async getMe(authHeader: string) {
    const authInfo = await this.authService.authentication(authHeader);
    const {
      decodeAccessToken: { user_id },
    } = authInfo;
    return await wrapRequestHandler<SuccessResponse<User>>(
      this.userService,
      'get-me',
      {
        user_id,
      },
    );
  }

  async updateMe(authHeader: string, updateMeDto: UpdateMeDto) {
    const authInfo = await this.authService.authentication(authHeader);
    return await wrapRequestHandler<SuccessResponse<User>>(
      this.userService,
      'update-me',
      {
        authInfo,
        updateMeDto,
      },
    );
  }
  async changePassword(
    authHeader: string,
    changePasswordDto: ChangePasswordDto,
  ) {
    const authInfo = await this.authService.authentication(authHeader);
    return await wrapRequestHandler<SuccessResponse<User>>(
      this.userService,
      'change-password',
      {
        authInfo,
        changePasswordDto,
      },
    );
  }

  async uploadAvatar(file: Express.Multer.File) {
    if (!file) {
      throw new UnprocessableEntityException({
        message: USERS_MESSAGES.ERROR,
        data: {
          image: USERS_MESSAGES.IMAGE_IS_REQUIRED,
        },
      });
    }
    let input = process.cwd() + '/public/img/' + file.filename;
    let output = process.cwd() + '/public/imgOptimize/';
    const result = await compressImage(input, output);
    return await wrapRequestHandler<SuccessResponse<string>>(
      this.userService,
      'upload-avatar',
      {
        file,
        input,
        output,
        result,
      },
    );
  }
}
