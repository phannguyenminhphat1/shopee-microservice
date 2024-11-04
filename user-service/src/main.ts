import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { initFolder } from './utils/uploads/file';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:1234@localhost:5672'],
        queue: 'user_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  initFolder();
  await app.listen();
}
bootstrap();
