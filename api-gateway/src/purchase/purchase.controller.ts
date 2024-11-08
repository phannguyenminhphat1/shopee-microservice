import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post('add-to-cart')
  async addToCart(
    @Headers('authorization') authHeader: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return await this.purchaseService.addToCart(authHeader, addToCartDto);
  }

  @Get('get-purchases')
  async getPurchases(
    @Headers('authorization') authHeader: string,
    @Query('status') status: number,
  ) {
    return await this.purchaseService.getPurchases(authHeader, status);
  }

  @Post('buy-products')
  async buyProducts(
    @Headers('authorization') authHeader: string,
    @Body('purchase_id') purchase_id: number[],
  ) {
    return await this.purchaseService.buyProducts(authHeader, purchase_id);
  }
}
