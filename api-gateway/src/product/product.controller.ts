import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProductService } from './product.service';
import { QueryProductDto } from './dto/query-product.dto';
import { ERROR } from 'src/constants/error';
import { GetProductDto } from './dto/get-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UsePipes(ERROR.UNPROCESSABLE_ENTITY_EXCEPTION)
  @Get('get-products')
  async getProducts(@Query() queryProductDto: QueryProductDto) {
    return await this.productService.getProducts(queryProductDto);
  }

  @UsePipes(ERROR.BAD_REQUEST_EXCEPTION)
  @Get('get-product/:stores_products_id')
  async getProduct(@Param() getProductDto: GetProductDto) {
    return await this.productService.getProduct(getProductDto);
  }
}
