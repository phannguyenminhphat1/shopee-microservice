import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [ProductController],
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'product_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class ProductModule {}
