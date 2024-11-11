import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UserRole } from 'src/constants/enum';
import { AuthService } from 'src/auth/auth.service';
import { wrapRequestHandler } from 'src/utils/wrapRequestHandler';
import { SuccessResponse } from 'src/constants/response';

@Injectable()
export class PurchaseService {
  constructor(
    private authService: AuthService,
    @Inject('PURCHASE_SERVICE') private purchaseService: ClientProxy,
  ) {}

  async addToCart(authHeader: string, addToCartDto: AddToCartDto) {
    const authInfo = await this.authService.authentication(authHeader);
    const { user_id } = authInfo.decodeAccessToken;
    await this.authService.rolesGuard([UserRole.USER], user_id);
    return await wrapRequestHandler<
      SuccessResponse<{ stores_products_id: number; buy_count: number }>
    >(this.purchaseService, 'add-to-cart', {
      authInfo,
      addToCartDto,
    });
  }

  async getPurchases(authHeader: string, status: number) {
    const authInfo = await this.authService.authentication(authHeader);
    return await wrapRequestHandler(this.purchaseService, 'get-purchases', {
      authInfo,
      status,
    });
  }

  async buyProducts(authHeader: string, purchase_id: number[]) {
    const authInfo = await this.authService.authentication(authHeader);
    const { user_id } = authInfo.decodeAccessToken;
    await this.authService.rolesGuard([UserRole.USER], user_id);
    return await wrapRequestHandler(this.purchaseService, 'buy-products', {
      authInfo,
      purchase_id,
    });
  }

  async deletePurchases(authHeader: string, purchase_id: number[]) {
    const authInfo = await this.authService.authentication(authHeader);
    const { user_id } = authInfo.decodeAccessToken;
    await this.authService.rolesGuard([UserRole.USER], user_id);
    return await wrapRequestHandler(this.purchaseService, 'delete-purchases', {
      authInfo,
      purchase_id,
    });
  }

  async updatePurchase(
    authHeader: string,
    purchase_id: number,
    buy_count: number,
  ) {
    const authInfo = await this.authService.authentication(authHeader);
    const { user_id } = authInfo.decodeAccessToken;
    await this.authService.rolesGuard([UserRole.USER], user_id);
    return await wrapRequestHandler(this.purchaseService, 'update-purchase', {
      authInfo,
      purchase_id,
      buy_count,
    });
  }

  // ROLE ADMIN
  async confirmPurchase(authHeader: string, purchase_id: number) {
    const authInfo = await this.authService.authentication(authHeader);
    const { user_id } = authInfo.decodeAccessToken;
    await this.authService.rolesGuard([UserRole.ADMIN], user_id);
    return await wrapRequestHandler(this.purchaseService, 'confirm-purchase', {
      authInfo,
      purchase_id,
    });
  }
}
