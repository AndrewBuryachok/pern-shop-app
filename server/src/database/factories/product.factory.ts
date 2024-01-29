import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Product } from '../../features/products/product.entity';
import {
  MAX_AMOUNT_VALUE,
  MAX_INTAKE_VALUE,
  MAX_ITEM_VALUE,
  MAX_KIT_VALUE,
} from '../../common/constants';

define(Product, (faker: Faker) => {
  const product = new Product();
  product.item = Math.floor(Math.random() * MAX_ITEM_VALUE) + 1;
  product.description = '';
  product.amount = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  product.intake = Math.floor(Math.random() * MAX_INTAKE_VALUE) + 1;
  product.kit = Math.floor(Math.random() * MAX_KIT_VALUE) + 1;
  product.price = Math.floor(Math.random() * 200) + 1;
  if (Math.random() > 0.8) {
    product.completedAt = new Date();
  }
  return product;
});
