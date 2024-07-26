import { Controller, Get } from '@nestjs/common';
import { ProductListingsService } from './product-listings.service';

@Controller('product-listings')
export class ProductListingsController {
  constructor(private readonly productListingService: ProductListingsService) {}

  @Get('/')
  injectListings() {
    this.productListingService.injectListings('ACCESS TOKEN HERE');
  }
}
