import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EncryptionService } from 'src/encryption/encryption.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RefreshTokensService {
  private readonly logger = new Logger(RefreshTokensService.name);
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  async createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    const encryptedKey = await this.encryptionService.encrypt(data.token);
    this.logger.log(`Encrypted Key is: ${encryptedKey}`);
    return this.prisma.refreshToken.upsert({
      where: { portalId: data.portalId },
      create: {
        ...data,
        token: encryptedKey,
      },
      update: { ...data },
    });
  }
}
