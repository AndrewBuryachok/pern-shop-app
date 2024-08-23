import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { GoodState } from '../../features/goods/good-state.entity';

define(GoodState, (faker: Faker) => {
  const goodState = new GoodState();
  return goodState;
});
