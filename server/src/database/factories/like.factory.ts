import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Like } from '../../features/articles/like.entity';

define(Like, (faker: Faker) => {
  const like = new Like();
  return like;
});
