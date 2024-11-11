import {
  HttpStatus,
  UnprocessableEntityException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, of } from 'rxjs';
import { catchError, timeout, retry } from 'rxjs/operators';

export function applyRetryStrategy(retryCount = 3, timeoutMs = 2000) {
  return (source: any) =>
    source.pipe(
      timeout(timeoutMs),
      retry(retryCount),
      catchError((err) => {
        if (!err.status) {
          return of({
            error: 'Server lỗi. Hãy thử lại sau.',
          } as any);
        }
        throw err;
      }),
    );
}

export async function wrapRequestHandler<T>(
  service: ClientProxy,
  pattern: string,
  data: any,
  retryCount = 3,
  timeoutMs = 2000,
): Promise<T> {
  try {
    return await lastValueFrom(
      service
        .send<T>(pattern, data)
        .pipe(applyRetryStrategy(retryCount, timeoutMs)),
    );
  } catch (error) {
    handleError(error);
  }
}

export function handleError(error: any) {
  switch (error.status) {
    case HttpStatus.UNPROCESSABLE_ENTITY:
      throw new UnprocessableEntityException(error);
    case HttpStatus.UNAUTHORIZED:
      throw new UnauthorizedException(error);
    case HttpStatus.NOT_FOUND:
      throw new NotFoundException(error);
    case HttpStatus.FORBIDDEN:
      throw new ForbiddenException(error);
    case HttpStatus.INTERNAL_SERVER_ERROR:
      throw new InternalServerErrorException(error);
    default:
      throw error;
  }
}
