import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Market } from '../../features/markets/market.entity';
import {
  MAX_COORDINATE_VALUE,
  MIN_COORDINATE_VALUE,
} from '../../common/constants';

define(Market, (faker: Faker) => {
  const market = new Market();
  market.name = faker.address.city();
  market.x =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  market.y =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  market.price = Math.floor(Math.random() * 32) + 1;
  return market;
});
