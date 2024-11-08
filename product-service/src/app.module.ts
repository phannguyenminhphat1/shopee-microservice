import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ElasticModule } from './elastic/elastic.module';

@Module({
  imports: [ProductModule, ElasticModule],
})
export class AppModule {}
