import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Rating } from '../../features/ratings/rating.entity';

define(Rating, (faker: Faker) => {
  const rating = new Rating();
  rating.rate = Math.floor(Math.random() * 5) + 1;
  return rating;
});
