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
      .map(() => faker.location.zipCode('#####'))
      .flatMap((zip) =>
        [...new Array(numHousePerZip)].map(() => ({
          properties: {
            name: `${faker.commerce.productName()} House`,
            address: faker.location.streetAddress(),
            hs_images: faker.image.urlLoremFlickr({
              category: 'house',
            }),
            price: faker.commerce.price({ min: 50000, max: 1000000 }),
            description: faker.commerce.productAdjective() + ' House!',
            zip,
          },
          associations: [],
        })),
      );

    this.logger.log('Inject Listing Inputs');
    this.logger.log(inputs);
    try {
      const result = await hubspotClient.crm.products.batchApi.create({
        inputs,
      });
      this.logger.log('Inject Listing Result');
      this.logger.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  async getListings(accessToken: string) {
    const hubspotClient = new Client({ accessToken });
    try {
      const result = (
        await hubspotClient.crm.products.basicApi.getPage(100, undefined, [
          'name',
          'price',
          'zip',
          'address',
          'hs_images',
          'description',
        ])
      ).results;
      return result.map((product) => ({
        name: product.properties.name,
        price: product.properties.price,
        zip: product.properties.zip,
        address: product.properties.address,
        imageUrl: product.properties.hs_images,
        description: product.properties.description,
      }));
    } catch (e) {
      console.log(e);
    }
  }

  async getListingsForZip(accessToken: string, zip: string) {
    return (await this.getListings(accessToken)).filter(
      (product) => product.zip === zip,
    );
  }
}
