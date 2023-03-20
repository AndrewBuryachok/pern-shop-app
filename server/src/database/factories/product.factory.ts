import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Product } from '../../features/products/product.entity';

define(Product, (faker: Faker) => {
  const product = new Product();
  product.item = Math.floor(Math.random() * 1050) + 1;
  product.description = faker.lorem.sentence(3);
  product.amount = Math.floor(Math.random() * 16) + 1;
  product.intake = Math.floor(Math.random() * 64) + 1;
  product.kit = Math.floor(Math.random() * 3) + 1;
  product.price = Math.floor(Math.random() * 200) + 1;
  return product;
});
