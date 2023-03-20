import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Poll } from '../../features/polls/poll.entity';

define(Poll, (faker: Faker) => {
  const poll = new Poll();
  poll.description = faker.lorem.sentence(3);
  const completed = !!Math.floor(Math.random() * 2);
  if (completed) {
    poll.completedAt = new Date();
  }
  return poll;
});
