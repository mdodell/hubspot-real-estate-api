import { Controller, Get, Logger, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ProductListingsService } from './product-listings/product-listings.service';

@Controller('app')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly productListingService: ProductListingsService,
  ) {}

  @Get('/oauth-callback')
  // TODO: Update this to be an App Settings Page to showcase install experience :)
  @Redirect('https://hubspot.com', 301)
  oauthCallback(@Query('code') code: string) {
    this.appService.installApp(code).then((accessToken) => {
      console.log(accessToken);
      this.productListingService.injectListings(accessToken);
    });
  }
}

/*
curl --request POST \
  --url https://api.hubapi.com/crm/v3/objects/products \
  --header 'authorization: Bearer COHFn-CMMhIEAAECQBjhu5sWIKmOhwwogPDZATIUilW2YaFw9ntYdU-YfTzEk4WZyvU6MAAAAEEAAAAAAPgDAAAAAAAAgAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAkIUJs48yZhHzgxac2PQGld7zk0kAmpKA25hMVIAWgBgAA' \
  --header 'content-type: application/json' \
  --data '{
  "properties": {
    "zip": "10451",
    "name": "silly house",
    "price": "10000000"
  }
}'
*/
