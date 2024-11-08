import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QueryProductDto } from './dto/query-product.dto';
import { GetProductDto } from './dto/get-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('get-products')
  async getProducts(@Payload() queryProductDto: QueryProductDto) {
    return await this.productService.getProducts(queryProductDto);
  }

  @MessagePattern('get-product')
  async getProduct(@Payload() stores_products_id: number) {
    return await this.productService.getProduct(stores_products_id);
  }

  @MessagePattern('update-stock-quantity')
  async updateStockQuantity(
    @Payload() payload: { stores_products_id: number; buy_count: number },
  ) {
    return await this.productService.updateStockQuantity(
      payload.stores_products_id,
      payload.buy_count,
    );
  }
}
