import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Vote } from '../../features/polls/vote.entity';

define(Vote, (faker: Faker) => {
  const vote = new Vote();
  vote.type = !!Math.floor(Math.random() * 2);
  return vote;
});
