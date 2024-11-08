import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { QueryProductDto } from './dto/query-product.dto';
import { Order, SortBy } from 'src/constants/enum';
import { RpcException } from '@nestjs/microservices';
import { USERS_MESSAGES } from 'src/constants/messages';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { GetProductDto } from './dto/get-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private elasticSearchService: ElasticsearchService,
  ) {}

  async getProducts(queryProductDto: QueryProductDto) {
    const {
      sort_by,
      order,
      rating_filter,
      product_name,
      price_min,
      price_max,
      category,
    } = queryProductDto;
    const limit = queryProductDto.limit ? Number(queryProductDto.limit) : 10;
    const page = queryProductDto.page ? Number(queryProductDto.page) : 1;
    const sortOrder = order === Order.ASC ? 'asc' : 'desc';

    const priceMin = price_min ? Number(price_min) : undefined;
    const priceMax = price_max ? Number(price_max) : undefined;

    // priceMin và priceMax
    if (priceMin !== undefined && priceMin <= 0) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          price_min: USERS_MESSAGES.PRICE_CANNOT_BE_NEGATIVE,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    if (priceMax !== undefined && priceMax <= 0) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          price_max: USERS_MESSAGES.PRICE_CANNOT_BE_NEGATIVE,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    if (priceMin && priceMax && priceMin > priceMax) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          price: USERS_MESSAGES.PRICE_MIN_CANNOT_BE_GREATER_THAN_MAX_PRICE,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    // Kiểm tra danh mục
    if (category) {
      const findCategory = await this.prismaService.categories.findUnique({
        where: { category_id: Number(category) },
      });
      if (!findCategory) {
        throw new RpcException({
          message: USERS_MESSAGES.CATEGORY_NOT_FOUND,
          status: HttpStatus.NOT_FOUND,
        });
      }
    }

    // Search Query
    const searchQuery: any = {
      index: 'stores-products-index',
      body: {
        query: {
          bool: {
            must: [],
            filter: [],
          },
        },
        sort: [],
        from: (page - 1) * limit,
        size: limit,
      },
    };

    if (priceMin !== undefined) {
      searchQuery.body.query.bool.filter.push({
        range: { price: { gte: priceMin } },
      });
    }
    if (priceMax !== undefined) {
      searchQuery.body.query.bool.filter.push({
        range: { price: { lte: priceMax } },
      });
    }
    if (product_name) {
      searchQuery.body.query.bool.must.push({
        match: { product_name: product_name },
      });
    }
    if (rating_filter) {
      searchQuery.body.query.bool.filter.push({
        range: { rating: { gte: rating_filter } },
      });
    }
    if (category) {
      searchQuery.body.query.bool.filter.push({
        term: { category_id: Number(category) },
      });
    }

    // Sort by
    if (sort_by === SortBy.PRICE) {
      searchQuery.body.sort.push({ price: { order: sortOrder } });
    } else if (sort_by === SortBy.CREATED_AT || (!sort_by && order)) {
      searchQuery.body.sort.push({ created_at: { order: sortOrder } });
    } else if (sort_by === SortBy.VIEW) {
      searchQuery.body.sort.push({ view: { order: sortOrder } });
    } else if (sort_by === SortBy.SOLD) {
      searchQuery.body.sort.push({ sold: { order: sortOrder } });
    }

    const result = await this.elasticSearchService.search(searchQuery);
    const total = (result.hits.total as any).value;
    const products = result.hits.hits.map((hit) => hit._source);

    return {
      message: USERS_MESSAGES.GET_PRODUCTS_SUCCESS,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          page_size: Math.ceil(total / limit),
        },
      },
    };
  }

  async getProduct(stores_products_id: number) {
    const product = await this.prismaService.stores_products.findUnique({
      where: { stores_products_id: Number(stores_products_id) },
      include: { stores: true, products: true },
    });
    if (!product) {
      throw new RpcException({
        message: USERS_MESSAGES.PRODUCT_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return {
      message: USERS_MESSAGES.GET_PRODUCT_SUCCESS,
      data: product,
    };
  }

  async updateStockQuantity(stores_products_id: number, buy_count: number) {
    await this.prismaService.stores_products.update({
      where: { stores_products_id },
      data: {
        stock_quantity: {
          decrement: buy_count,
        },
      },
    });
    return {
      message: USERS_MESSAGES.UPDATE_STOCK_QUANTITY_SUCCESSFULLY,
    };
  }
}
