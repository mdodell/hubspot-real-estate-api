import { Test, TestingModule } from '@nestjs/testing';
import { ProductListingsService } from './product-listings.service';

describe('ProductListingsService', () => {
  let service: ProductListingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductListingsService],
    }).compile();

    service = module.get<ProductListingsService>(ProductListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
