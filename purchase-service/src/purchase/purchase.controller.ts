import { Controller } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { stores_products } from '@prisma/client';

@Controller()
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @MessagePattern('add-to-cart')
  async addToCart(
    @Payload()
    payload: {
      authInfo: AuthInfo;
      addToCartDto: AddToCartDto;
    },
  ) {
    return await this.purchaseService.addToCart(payload);
  }

  @MessagePattern('get-purchases')
  async getPurchases(
    @Payload() payload: { authInfo: AuthInfo; status: number },
  ) {
    return await this.purchaseService.getPurchases(payload);
  }

  @MessagePattern('buy-products')
  async buyProducts(
    @Payload() payload: { authInfo: AuthInfo; purchase_id: number[] },
  ) {
    return await this.purchaseService.buyProducts(payload);
  }

  @MessagePattern('delete-purchases')
  async deletePurchases(
    @Payload() payload: { authInfo: AuthInfo; purchase_id: number[] },
  ) {
    return await this.purchaseService.deletePurchases(payload);
  }

  @MessagePattern('update-purchase')
  async updatePurchase(
    @Payload()
    payload: {
      authInfo: AuthInfo;
      purchase_id: number;
      buy_count: number;
    },
  ) {
    return await this.purchaseService.updatePurchase(payload);
  }

  // ROLE ADMIN
  @MessagePattern('confirm-purchase')
  async confirmPurchase(
    @Payload()
    payload: {
      authInfo: AuthInfo;
      purchase_id: number;
    },
  ) {
    return await this.purchaseService.confirmPurchase(payload);
  }
}
