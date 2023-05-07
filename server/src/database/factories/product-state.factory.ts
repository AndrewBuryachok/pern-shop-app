import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { ProductState } from '../../features/products/product-state.entity';

define(ProductState, (faker: Faker) => {
  const productState = new ProductState();
  return productState;
});
