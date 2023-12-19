import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Shop } from '../../features/shops/shop.entity';
import {
  MAX_COORDINATE_VALUE,
  MIN_COORDINATE_VALUE,
} from '../../common/constants';

define(Shop, (faker: Faker) => {
  const shop = new Shop();
  shop.name = faker.address.city();
  shop.image = '';
  shop.description = '';
  shop.x =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  shop.y =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  return shop;
});
