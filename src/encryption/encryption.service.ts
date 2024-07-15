import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-cbc';

@Injectable()
export class EncryptionService {
  constructor(private configService: ConfigService) {}

  private readonly key = this.configService.get('KEY');

  async encrypt(data: string) {
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, Buffer.from(this.key, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  async decrypt(data: string) {
    const [ivHex, encryptedHex] = data.split(':');
    const decipher = createDecipheriv(
      algorithm,
      Buffer.from(this.key, 'hex'),
      Buffer.from(ivHex, 'hex'),
    );
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
