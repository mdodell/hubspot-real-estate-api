import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';
import { RefreshTokensService } from './refresh-tokens/refresh-tokens.service';
import { PrismaService } from './prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import { EncryptionService } from './encryption/encryption.service';
import { ProductListingsService } from './product-listings/product-listings.service';
import { ProductListingsController } from './product-listings/product-listings.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  ],
  controllers: [AppController, ProductListingsController],
  providers: [
    AppService,
    RefreshTokensService,
    PrismaService,
    EncryptionService,
    ProductListingsService,
  ],
})
export class AppModule {}
