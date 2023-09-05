import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Bid } from '../../features/bids/bid.entity';

define(Bid, (faker: Faker) => {
  const bid = new Bid();
  return bid;
});
