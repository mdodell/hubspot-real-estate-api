import { Controller, Get } from '@nestjs/common';
import { ProductListingsService } from './product-listings.service';

@Controller('product-listings')
export class ProductListingsController {
  constructor(private readonly productListingService: ProductListingsService) {}

  @Get('/')
  injectListings() {
    this.productListingService.injectListings(
      'COHFn-CMMhIEAAECQBjhu5sWIKmOhwwogPDZATIUilW2YaFw9ntYdU-YfTzEk4WZyvU6MAAAAEEAAAAAAPgDAAAAAAAAgAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAkIUJs48yZhHzgxac2PQGld7zk0kAmpKA25hMVIAWgBgAA',
    );
  }
}
