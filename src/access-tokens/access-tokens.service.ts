import { Client } from '@hubspot/api-client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensService } from 'src/refresh-tokens/refresh-tokens.service';

@Injectable()
export class AccessTokensService {
  private readonly logger = new Logger(AccessTokensService.name);
  private readonly hubspotClient = new Client();

  constructor(
    private configService: ConfigService,
    private refreshTokensService: RefreshTokensService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAccessToken(portalId: number) {
    this.logger.log(`Get Access Token: portalId~${portalId}`);
    const accessTokenMaybe = await this.cacheManager.get<string>(
      `${portalId}-accessToken`,
    );
    if (accessTokenMaybe) {
      this.logger.log(
        `Get Access Token found: accessToken~${accessTokenMaybe}`,
      );
      return accessTokenMaybe;
    } else {
      this.logger.log(`Get Access Token not found, refreshing`);
      return this.refreshAccessToken(portalId);
    }
  }

  async setAccessToken(portalId, accessToken) {
    return await this.cacheManager.set(`${portalId}-accessToken`, accessToken);
  }

  async refreshAccessToken(portalId: number) {
    const refreshToken =
      await this.refreshTokensService.getRefreshToken(portalId);
    const response = await this.hubspotClient.oauth.tokensApi.create(
      'refresh_token',
      null, // no code for Access Token Refresh
      this.configService.get('REDIRECT_URI'),
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      refreshToken,
    );
    await this.setAccessToken(portalId, response.accessToken);
    return response.accessToken;
  }
}
