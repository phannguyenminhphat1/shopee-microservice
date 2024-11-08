import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { JwtModule } from '@nestjs/jwt';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [UserModule, AuthModule, ProductModule, CategoryModule, PurchaseModule],
})
export class AppModule {}
