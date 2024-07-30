import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app
    .useBodyParser('json', { limit: '10mb', extended: true })
    .listen(3000);
}
bootstrap();
