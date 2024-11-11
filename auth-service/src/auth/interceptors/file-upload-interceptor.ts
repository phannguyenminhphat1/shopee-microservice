import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import { tap } from 'rxjs/operators';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const data = context.switchToRpc().getData();
    console.log(data);
    // if (data && data.file) {
    //   // Giả sử dữ liệu 'file' là Buffer và 'filename' là tên file
    //   const { file, filename } = data;

    //   // Lưu file vào hệ thống
    //   fs.promises
    //     .writeFile(`uploads/${filename}`, file)
    //     .then(() => console.log('File saved'))
    //     .catch((error) => {
    //       throw new RpcException('Failed to save file');
    //     });
    // }

    return next.handle().pipe(
      tap(() => {
        console.log('File upload interceptor applied');
      }),
    );
  }
}
