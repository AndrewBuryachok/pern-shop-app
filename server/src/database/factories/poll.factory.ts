import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Poll } from '../../features/polls/poll.entity';
import { Result } from '../../features/polls/result.enum';
import { MAX_MARK_VALUE } from '../../common/constants';

define(Poll, (faker: Faker) => {
  const poll = new Poll();
  poll.text = faker.lorem.sentence(7);
  poll.mark = Math.floor(Math.random() * MAX_MARK_VALUE) + 1;
  poll.image = `https://picsum.photos/seed/${faker.lorem.word()}/960/480`;
  poll.video = '';
  const completed = !!Math.floor(Math.random() * 2);
  if (completed) {
    poll.result = !!Math.floor(Math.random() * 2)
      ? Result.APPROVED
      : Result.REJECTED;
    poll.completedAt = new Date();
  }
  return poll;
});
