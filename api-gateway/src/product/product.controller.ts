import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('product')
export class ProductController {
  constructor(@Inject('PRODUCT_SERVICE') private productService: ClientProxy) {}

  @Get('get-products-all')
  async getProductsAll() {
    return await lastValueFrom(
      this.productService.send('get-products-all', ''),
    );
  }
}
