import { faker } from '@faker-js/faker/locale/uk';
import { define } from 'typeorm-seeding';
import { Market } from '../../features/markets/market.entity';
import {
  MAX_COORDINATE_VALUE,
  MIN_COORDINATE_VALUE,
} from '../../common/constants';

define(Market, () => {
  const market = new Market();
  market.name = `Ринок ${faker.address.cityName()}`;
  market.description = '';
  market.x =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  market.y =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  return market;
});
