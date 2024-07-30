import { Test, TestingModule } from '@nestjs/testing';
import { ProductListingsController } from './product-listings.controller';

describe('ProductListingsController', () => {
  let controller: ProductListingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductListingsController],
    }).compile();

    controller = module.get<ProductListingsController>(
      ProductListingsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
