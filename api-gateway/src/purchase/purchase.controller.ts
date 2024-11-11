import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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

  @Delete('delete-purchases')
  async deletePurchases(
    @Headers('authorization') authHeader: string,
    @Body('purchase_id') purchase_id: number[],
  ) {
    return await this.purchaseService.deletePurchases(authHeader, purchase_id);
  }

  @Put('update-purchase')
  async updatePurchase(
    @Headers('authorization') authHeader: string,
    @Body('purchase_id') purchase_id: number,
    @Body('buy_count') buy_count: number,
  ) {
    return await this.purchaseService.updatePurchase(
      authHeader,
      purchase_id,
      buy_count,
    );
  }

  // ROLE ADMIN
  @Post('confirm-purchase')
  async confirmPurchase(
    @Headers('authorization') authHeader: string,
    @Body('purchase_id') purchase_id: number,
  ) {
    return await this.purchaseService.confirmPurchase(authHeader, purchase_id);
  }
}
