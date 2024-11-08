import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { QueryProductDto } from './dto/query-product.dto';
import { lastValueFrom } from 'rxjs';
import { catchError, of, retry, timeout } from 'rxjs';
import { GetProductDto } from './dto/get-product.dto';
import { wrapRequestHandler } from 'src/utils/wrapRequestHandler';
import {
  Pagination,
  ProductElastic,
  StoresProducts,
} from 'src/constants/types';
import { SuccessResponse } from 'src/constants/response';

@Injectable()
export class ProductService {
  constructor(@Inject('PRODUCT_SERVICE') private productService: ClientProxy) {}

  async getProducts(queryProductDto: QueryProductDto) {
    return await wrapRequestHandler<
      SuccessResponse<{ products: ProductElastic[]; pagination: Pagination }>
    >(this.productService, 'get-products', queryProductDto);
  }

  async getProduct(getProductDto: GetProductDto) {
    return await wrapRequestHandler<SuccessResponse<StoresProducts>>(
      this.productService,
      'get-product',
      getProductDto.stores_products_id,
    );
  }
}
