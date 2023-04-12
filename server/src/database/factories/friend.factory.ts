import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Friend } from '../../features/friends/friend.entity';

define(Friend, (faker: Faker) => {
  const friend = new Friend();
  friend.type = !!Math.floor(Math.random() * 2);
  return friend;
});
