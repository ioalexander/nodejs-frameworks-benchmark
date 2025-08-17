import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const adapter = new FastifyAdapter();

  const app = (await NestFactory.create(
    AppModule,
    adapter as any,
  )) as NestFastifyApplication;

  await app.listen(3002);
}
bootstrap();
