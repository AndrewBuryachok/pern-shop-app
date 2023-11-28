import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Rating } from '../../features/ratings/rating.entity';
import { MAX_RATE_VALUE } from '../../common/constants';

define(Rating, (faker: Faker) => {
  const rating = new Rating();
  rating.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
  return rating;
});
