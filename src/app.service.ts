import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { HandshakeDTO } from './dtos/oauth/access-token.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async installApp(code: string) {
    this.logger.log(`Attempting to make an oauth handshake with code: ${code}`);
    if (!code) {
      throw new HttpException(
        'There must be a code in the callback function',
        HttpStatus.BAD_REQUEST,
      );
    }

    const params = {
      grant_type: 'authorization_code',
      client_id: this.configService.get('CLIENT_ID'),
      client_secret: this.configService.get('CLIENT_SECRET'),
      redirect_uri: this.configService.get('REDIRECT_URI'),
      code,
    };

    const { data } = await this.httpService.axiosRef
      .post<HandshakeDTO>('', params)
      .catch((error: AxiosError) => {
        const errorMessage = error.response.data;
        this.logger.error(
          `There was an error getting an access token for the app: ${errorMessage}`,
        );
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      });

    this.logger.log(data);
    return data;
  }
}
