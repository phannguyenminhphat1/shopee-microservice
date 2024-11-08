import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Order, SortBy } from 'src/constants/enum';
import { PaginationDto } from './pagination.dto';

export class QueryProductDto extends PaginationDto {
  @IsOptional()
  @IsEnum(SortBy, {
    message: 'Phải là các giá trị: view, created_at, sold, price',
  })
  sort_by?: SortBy;

  @IsOptional()
  @IsEnum(Order, { message: 'Order phải nằm là asc hoặc desc' })
  order?: Order;

  @Type(() => Number)
  @IsNumber({}, { message: 'Giá phải là số' })
  @IsOptional()
  price_min?: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Giá phải là số' })
  @IsOptional()
  price_max?: number;

  @IsOptional()
  @IsString({
    message: 'Tên sản phẩm phải là chuỗi',
  })
  product_name?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Category phải là số' })
  @IsOptional()
  category?: number; // categoryId

  @Type(() => Number)
  @IsNumber({}, { message: 'Rating phải là số' })
  @IsOptional()
  rating_filter?: number;
}
