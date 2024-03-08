import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { PollView } from '../../features/polls/poll-view.entity';

define(PollView, (faker: Faker) => {
  const view = new PollView();
  return view;
});
