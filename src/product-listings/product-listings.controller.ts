import {
  Controller,
  Get,
  Inject,
  Logger,
  Query,
  Request,
} from '@nestjs/common';
import { ProductListingsService } from './product-listings.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('product-listings')
export class ProductListingsController {
  private readonly logger = new Logger(ProductListingsController.name);
  constructor(
    private readonly productListingService: ProductListingsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('/')
  injectListings() {
    //this.productListingService.injectListings('ACCESS TOKEN HERE');
  }

  @Get('/get-listings')
  async getListings() {
    const result =
      await this.productListingService.getListings('ACCESS TOKEN HERE');
    console.log(`Fetched ${result.length} product listings`);
    return result;
  }

  @Get('/get-listings-for-zip')
  async getListingsForZip(
    @Request() request: Request,
    @Query('zip') zip: string,
    @Query('portalId') portalId,
  ) {
    this.logger.log('REQUEST');
    this.logger.log(request.toString());
    const accessToken = await this.cacheManager.get<string>(
      `${portalId}-accessToken`,
    );

    this.logger.log(`Access Token: ${accessToken}`);
    const result = await this.productListingService.getListingsForZip(
      accessToken,
      zip,
    );
    console.log(`Fetched ${result.length} product listings for zip ${zip}`);
    return result;
  }
}
