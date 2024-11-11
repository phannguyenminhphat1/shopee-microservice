import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ShippingController],
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'SHIPPING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'shipping_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [ShippingService],
})
export class ShippingModule {}
