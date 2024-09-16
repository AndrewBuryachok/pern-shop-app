import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { PollLike } from '../../features/polls/poll-like.entity';

define(PollLike, (faker: Faker) => {
  const like = new PollLike();
  like.type = !!Math.floor(Math.random() * 2);
  return like;
});
