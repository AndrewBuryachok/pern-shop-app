import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Poll } from '../../features/polls/poll.entity';
import { Result } from '../../features/polls/result.enum';

define(Poll, (faker: Faker) => {
  const poll = new Poll();
  poll.title = faker.lorem.sentence(3);
  poll.text = faker.lorem.sentence(7);
  const completed = !!Math.floor(Math.random() * 2);
  if (completed) {
    poll.result = !!Math.floor(Math.random() * 2)
      ? Result.APPROVED
      : Result.REJECTED;
    poll.completedAt = new Date();
  }
  return poll;
});
