import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('picking-purchase')
  async pickingPurchase(
    @Headers('authorization') authHeader: string,
    @Body('shipping_id') shipping_id: number,
  ) {
    return await this.shippingService.pickingPurchase(authHeader, shipping_id);
  }

  @Post('canceled-delivered')
  async canceledAndDeliveredPurchase(
    @Headers('authorization') authHeader: string,
    @Body('shipping_id') shipping_id: number,
    @Body('status') status: number,
  ) {
    return await this.shippingService.canceledAndDeliveredPurchase(
      authHeader,
      shipping_id,
      status,
    );
  }
}
