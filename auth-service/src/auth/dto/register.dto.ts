export class RegisterDto {
  full_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number: string;

  // @IsNotEmpty({ message: USERS_MESSAGES.ADDRESS_IS_REQUIRED })
  // @Length(5, 255, {
  //   message: USERS_MESSAGES.ADDRESS_LENGTH_MUST_BE_FROM_5_TO_255,
  // })
  // address: string;
}
