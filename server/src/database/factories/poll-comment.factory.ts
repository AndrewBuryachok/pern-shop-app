import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { PollComment } from '../../features/polls/comment.entity';

define(PollComment, (faker: Faker) => {
  const comment = new PollComment();
  comment.text = faker.lorem.sentence(7);
  return comment;
});
