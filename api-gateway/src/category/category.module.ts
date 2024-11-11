import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [CategoryController],
  imports: [
    ClientsModule.register([
      {
        name: 'CATEGORY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@some-rabbit:5672'],
          queue: 'category_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class CategoryModule {}
