import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@hubspot/api-client';

import { RefreshTokensService } from './refresh-tokens/refresh-tokens.service';
import { AccessTokensService } from './access-tokens/access-tokens.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly hubspotClient = new Client();

  constructor(
    private configService: ConfigService,
    private refreshTokensService: RefreshTokensService,
    private accessTokensService: AccessTokensService,
  ) {}

  async getTokens(code: string) {
    this.logger.log(`getTokens:
        'REDIRECT_URI' ${this.configService.get('REDIRECT_URI')},
      'CLIENT_SECRET' ${this.configService.get('CLIENT_SECRET')},
      'CLIENT_ID' ${this.configService.get('CLIENT_ID')}`);
    const data = await this.hubspotClient.oauth.tokensApi.create(
      'authorization_code',
      code,
      this.configService.get('REDIRECT_URI'),
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
    );
    this.logger.log(`getTokensResult: ${JSON.stringify(data)}`);
    return data;
  }

  async getTokenInfo(accessToken: string) {
    // Get the information for the access token
    const tokenInfo =
      await this.hubspotClient.oauth.accessTokensApi.get(accessToken);

    return tokenInfo;
  }

  async installApp(code: string) {
    this.logger.log(`Attempting to make an oauth handshake with code: ${code}`);
    if (!code) {
      throw new HttpException(
        'There must be a code in the callback function',
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await this.getTokens(code);

    const tokenInfo = await this.getTokenInfo(data.accessToken);

    // Store the access token in the cache for 30 minutes, cached by hub ID
    await this.accessTokensService.setAccessToken(
      tokenInfo.hubId,
      data.accessToken,
    );

    await this.refreshTokensService.createRefreshToken({
      token: data.refreshToken,
      portalId: tokenInfo.hubId,
    });

    return data.accessToken;
  }
}
