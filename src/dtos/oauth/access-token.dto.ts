export class HandshakeDTO {
  readonly token_type: 'bearer';
  readonly access_token: string;
  readonly refresh_token: string;
  readonly expires_in: number;
}
