import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Discussion } from '../../features/discussions/discussion.entity';

define(Discussion, (faker: Faker) => {
  const discussion = new Discussion();
  discussion.text = faker.lorem.sentence(7);
  return discussion;
});
