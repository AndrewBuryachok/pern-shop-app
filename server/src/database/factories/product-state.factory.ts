import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { ProductState } from '../../features/products/product-state.entity';

define(ProductState, (faker: Faker) => {
  const productState = new ProductState();
  productState.price = Math.floor(Math.random() * 200) + 1;
  return productState;
});
