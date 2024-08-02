import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

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
import { HubspotSignatureVerificationMiddleware } from './hubspot-signature-verification/hubspot-signature-verification.middleware';
import { AccessTokensService } from './access-tokens/access-tokens.service';

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
    AccessTokensService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HubspotSignatureVerificationMiddleware).forRoutes({
      path: 'product-listings*',
      method: RequestMethod.ALL,
    });
  }
}
