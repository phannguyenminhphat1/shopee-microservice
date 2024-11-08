import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [PurchaseController],
  imports: [
    AuthModule,
    ProductModule,
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'PURCHASE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'purchase_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [PurchaseService],
})
export class PurchaseModule {}
