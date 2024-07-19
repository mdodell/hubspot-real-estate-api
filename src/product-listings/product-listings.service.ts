import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@hubspot/api-client';
import {
  BatchInputSimplePublicObjectInputForCreate,
  SimplePublicObjectInputForCreate,
} from '@hubspot/api-client/lib/codegen/crm/companies';
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductListingsService {
  private readonly logger = new Logger(ProductListingsService.name);

  async injectListings(accessToken: string) {
    const hubspotClient = new Client({ accessToken });
    const numZip = 3;
    const numHousePerZip = 5;
    const inputs: Array<SimplePublicObjectInputForCreate> = [
      ...new Array(numZip),
    ]
      .map(() => faker.location.zipCode())
      .flatMap((zip) =>
        [...new Array(numHousePerZip)].map(() => ({
          properties: {
            address: faker.location.streetAddress(),
            imageUrl: faker.image.urlLoremFlickr({
              category: 'house',
            }),
            price: faker.commerce.price({ min: 50000 }),
            description: faker.commerce.productAdjective() + ' House!',
            zip: zip,
          },
          associations: [],
        })),
      );

    this.logger.log('Inject Listing Inputs');
    this.logger.log(inputs);
    let result = await hubspotClient.crm.products.batchApi.create({ inputs });
    this.logger.log('Inject Listing Result');
    this.logger.log(result);
  }
}
