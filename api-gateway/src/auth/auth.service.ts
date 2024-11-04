import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private authService: ClientProxy) {}

  async login(req: any) {
    console.log(req.body);

    return this.authService.send('login', req.body);
  }
}
