import { Controller, Get, Query } from '@nestjs/common';
import { ProductListingsService } from './product-listings.service';

@Controller('product-listings')
export class ProductListingsController {
  constructor(private readonly productListingService: ProductListingsService) {}

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
  async getListingsForZip(@Query('zip') zip: string) {
    const result = await this.productListingService.getListingsForZip(
      'ACCESS TOKEN HERE',
      zip,
    );
    console.log(`Fetched ${result.length} product listings for zip ${zip}`);
    return result;
  }
}
