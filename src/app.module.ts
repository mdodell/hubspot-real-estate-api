import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.register({
      baseURL: 'https://api.hubapi.com/oauth/v1/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }),
    CacheModule.register({
      // Used for Access Tokens - matches TTL of HubSpot access tokens
      ttl: 30 * 6000,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
