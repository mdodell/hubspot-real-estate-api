import { Signature } from '@hubspot/api-client';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class HubspotSignatureVerificationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(
    HubspotSignatureVerificationMiddleware.name,
  );
  use(req: Request, res: Response, next: () => void) {
    this.logger.log(
      `HELLO FROM ${HubspotSignatureVerificationMiddleware.name}`,
    );
    this.logger.log(`Request: ${JSON.stringify(req)}`);
    this.logger.log(`Res: ${JSON.stringify(res)}`);
    const headers = req.headers;
    const hostName = headers['host'];
    const protocol = headers['x-forwarded-proto'];
    const path = req.url;
    const base = `${protocol}://${hostName}`;
    const method = req.method;
    const signature = headers['x-hubspot-signature-v3'];
    const timestampHeader = headers['x-hubspot-request-timestamp'];
    const clientSecret = process.env.CLIENT_SECRET;

    const timestamp = Number(timestampHeader);
    const reqURL = new URL(path, base);
    const url = reqURL.href;
    const bodyString = req.body.toString();
    const result = Signature.isValid({
      url,
      method,
      signature,
      clientSecret,
      timestamp,
      requestBody: bodyString,
      signatureVersion: 'v3',
    });
    console.log('result', result);
    if (!result) {
      throw new Error('Could not verify the HubSot v3 Signature');
    }
    next();
  }
}
