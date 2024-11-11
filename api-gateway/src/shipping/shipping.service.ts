import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/constants/enum';
import { SuccessResponse } from 'src/constants/response';
import { Shipping } from 'src/constants/types';
import { wrapRequestHandler } from 'src/utils/wrapRequestHandler';

@Injectable()
export class ShippingService {
  constructor(
    @Inject('SHIPPING_SERVICE') private shippingService: ClientProxy,
    private authService: AuthService,
  ) {}

  async pickingPurchase(authHeader: string, shipping_id: number) {
    const authInfo = await this.authService.authentication(authHeader);
    const { user_id } = authInfo.decodeAccessToken;
    await this.authService.rolesGuard([UserRole.SHIPPER], user_id);
    return await wrapRequestHandler<SuccessResponse<Shipping>>(
      this.shippingService,
      'picking-purchase',
      {
        authInfo,
        shipping_id,
      },
    );
  }

  async canceledAndDeliveredPurchase(
    authHeader: string,
    shipping_id: number,
    status: number,
  ) {
    const authInfo = await this.authService.authentication(authHeader);
    const { user_id } = authInfo.decodeAccessToken;
    await this.authService.rolesGuard([UserRole.SHIPPER], user_id);
    return await wrapRequestHandler<SuccessResponse<Shipping>>(
      this.shippingService,
      'canceled-delivered',
      {
        authInfo,
        shipping_id,
        status,
      },
    );
  }
}
