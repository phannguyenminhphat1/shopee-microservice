import { HttpStatus, ValidationPipe } from '@nestjs/common';

const UNPROCESSABLE_ENTITY_EXCEPTION = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});
const NOT_FOUND_EXCEPTION = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.NOT_FOUND,
});
const BAD_REQUEST_EXCEPTION = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
});
export const ERROR = {
  UNPROCESSABLE_ENTITY_EXCEPTION,
  NOT_FOUND_EXCEPTION,
  BAD_REQUEST_EXCEPTION,
};
