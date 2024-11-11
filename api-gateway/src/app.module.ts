import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    PurchaseModule,
    ShippingModule,
  ],
})
export class AppModule {}
