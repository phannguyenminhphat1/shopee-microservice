import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { USERS_MESSAGES } from 'src/constants/messages';
import { UpdateMeDto } from './dto/update-me.dto';
import cloudinary from 'src/utils/uploads/cloudinary';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { REGEX } from 'src/constants/regex';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
  ) {}

  updateMeFuncDto(updateMeDto?: UpdateMeDto) {
    const { address, avatar, date_of_birth, full_name, phone_number } =
      updateMeDto;

    const errors = [];

    // Validate `full_name`
    if (full_name !== undefined) {
      if (full_name === '') {
        errors.push(USERS_MESSAGES.NAME_IS_REQUIRED);
      }
      if (typeof full_name !== 'string') {
        errors.push(USERS_MESSAGES.NAME_MUST_BE_A_STRING);
      } else if (full_name.length < 2 || full_name.length > 100) {
        errors.push(USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_2_TO_100);
      }
    }

    // Validate `phone_number`
    if (phone_number !== undefined) {
      if (phone_number === '') {
        errors.push(USERS_MESSAGES.PHONE_IS_REQUIRED);
      }
      const phoneNumber = phone_number.trim();
      const isValidPhoneNumber = /^(\+84|84|0)\d{9,10}$/.test(phoneNumber); // example regex for VN phone numbers
      if (!isValidPhoneNumber) {
        errors.push(USERS_MESSAGES.PHONE_IS_INVALID);
      }
    }

    // Validate `date_of_birth`
    if (date_of_birth !== undefined) {
      if (date_of_birth === '') {
        errors.push(USERS_MESSAGES.DATE_OF_BIRTH_IS_REQUIRED);
      }
      const isValidDate = !isNaN(Date.parse(date_of_birth));
      if (!isValidDate) {
        errors.push(USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_A_VALID_DATE);
      }
    }

    // Validate `address`
    if (address !== undefined) {
      if (address === '') {
        errors.push(USERS_MESSAGES.ADDRESS_IS_REQUIRED);
      }
      if (typeof address !== 'string') {
        errors.push(USERS_MESSAGES.ADDRESS_MUST_BE_STRING);
      } else if (address.length < 5 || address.length > 255) {
        errors.push(USERS_MESSAGES.ADDRESS_LENGTH_MUST_BE_FROM_5_TO_255);
      }
    }

    // Validate `avatar` URL
    if (avatar) {
      if (typeof avatar !== 'string') {
        errors.push(USERS_MESSAGES.IMAGE_URL_MUST_BE_STRING);
      } else if (!REGEX.IMAGE_URL.test(avatar)) {
        errors.push(USERS_MESSAGES.IMAGE_URL_MUST_BE_VALID);
      } else if (avatar.length < 5 || avatar.length > 200) {
        errors.push(USERS_MESSAGES.IMAGE_URL_LENGTH);
      }
    }
    if (errors.length > 0) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          errors,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
  }

  changePasswordFuncDto(changePasswordDto?: ChangePasswordDto) {
    const { confirm_password, new_password, password } = changePasswordDto;
    const errors = [];
    // Validate `password`
    if (password !== undefined) {
      if (password === '') {
        errors.push(USERS_MESSAGES.PASSWORD_IS_REQUIRED);
      }
    }
    if (new_password !== undefined) {
      if (new_password === '') {
        errors.push(USERS_MESSAGES.PASSWORD_IS_REQUIRED);
      }
    }
    if (confirm_password !== undefined) {
      if (confirm_password === '') {
        errors.push(USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED);
      }
    }
    const newPassword = new_password.trim();
    const isValidPassword =
      newPassword.length >= 6 &&
      newPassword.length <= 50 &&
      REGEX.PASSWORD_RULE.test(newPassword);
    if (!isValidPassword) {
      errors.push(USERS_MESSAGES.PASSWORD_MUST_BE_STRONG);
    }
    if (errors.length > 0) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          errors,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
  }

  async getMe(payload: { user_id: number }) {
    const { user_id } = payload;
    const me = await this.prismaService.users.findUnique({
      where: {
        user_id,
      },
    });
    if (!me) {
      throw new RpcException({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return {
      message: USERS_MESSAGES.GET_ME_SUCCESS,
      data: me,
    };
  }

  async updateMe(payload: { authInfo: AuthInfo; updateMeDto: UpdateMeDto }) {
    const {
      updateMeDto: { address, date_of_birth, full_name, phone_number, avatar },
      authInfo: {
        decodeAccessToken: { user_id },
      },
    } = payload;
    this.updateMeFuncDto(payload.updateMeDto);
    const me = await this.getMe({ user_id });
    const newMe = await this.prismaService.users.update({
      where: { user_id: me.data.user_id },
      data: {
        full_name,
        address,
        date_of_birth: new Date(date_of_birth).toISOString(),
        phone_number,
        avatar,
      },
    });
    return {
      message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
      data: newMe,
    };
  }

  async changePassword(payload: {
    authInfo: AuthInfo;
    changePasswordDto: ChangePasswordDto;
  }) {
    const {
      changePasswordDto: { confirm_password, new_password, password },
      authInfo: {
        decodeAccessToken: { user_id },
      },
    } = payload;
    this.changePasswordFuncDto(payload.changePasswordDto);
    const me = await this.getMe({ user_id });
    const checkOldPassword = await bcrypt.compare(password, me.data.password);
    if (!checkOldPassword) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          password: USERS_MESSAGES.PASSWORD_IS_INCORRECT,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    if (new_password !== confirm_password)
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          confirm_password:
            USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    const newPasswordHash = await lastValueFrom(
      this.authService.send('hash-password', { new_password }),
    );
    const newMe = await this.prismaService.users.update({
      where: { user_id },
      data: {
        password: newPasswordHash,
        updated_at: new Date(),
      },
    });
    return {
      message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESSFULLY,
      data: newMe,
    };
  }

  async uploadAvatar(payload: {
    result: any;
    input: string;
    output: string;
    file: Express.Multer.File;
  }) {
    const { result, input, output, file } = payload;
    console.log(result);
    console.log(input);

    if (!result) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          image: USERS_MESSAGES.ERROR_WHILE_COMPRESSING_IMAGES,
        },
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    const cloudinaryResult = await cloudinary.uploader.upload(
      `${output}${file.filename}`,
    );
    fs.unlinkSync(`${output}${file.filename}`);
    fs.unlinkSync(input);
    return {
      message: USERS_MESSAGES.UPLOAD_SUCCESS,
      data: cloudinaryResult.url,
    };
  }
}
