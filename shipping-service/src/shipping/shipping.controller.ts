import { Controller } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthInfo } from 'src/constant/response';

@Controller()
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @MessagePattern('create-shipping')
  async createShipping(@Payload() payload: { purchase_id: number }) {
    return await this.shippingService.createShipping(payload);
  }

  @MessagePattern('picking-purchase')
  async pickingPurchase(
    @Payload() payload: { authInfo: AuthInfo; shipping_id: number },
  ) {
    return await this.shippingService.pickingPurchase(payload);
  }

  @MessagePattern('canceled-delivered')
  async canceledAndDeliveredPurchase(
    @Payload()
    payload: {
      authInfo: AuthInfo;
      shipping_id: number;
      status: number;
    },
  ) {
    return await this.shippingService.canceledAndDeliveredPurchase(payload);
  }
}
