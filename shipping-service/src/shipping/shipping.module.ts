import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [ShippingController],
  providers: [ShippingService, PrismaService],
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@some-rabbit:5672'],
          queue: 'product_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class ShippingModule {}
