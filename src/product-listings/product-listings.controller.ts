import { Controller, Get } from '@nestjs/common';
import { ProductListingsService } from './product-listings.service';

@Controller('product-listings')
export class ProductListingsController {
  constructor(private readonly productListingService: ProductListingsService) {}

  @Get('/')
  injectListings() {
    return 'hey';
    // this.productListingService.injectListings(
    //   'CMrujOKMMhIEAAECQBjhu5sWIKmOhwwogPDZATIUcD5tkAyuX9Zl-kosusPJn_MG2yA6MAAAAEEAAAAAAPgDAAAAAAAAgAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAkIU7LUtdvztRQXxnF_LxwMO5hfPxS1KA25hMVIAWgBgAA',
    // );
  }
}
