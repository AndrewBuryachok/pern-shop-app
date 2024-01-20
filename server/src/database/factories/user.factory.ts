import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { MAX_BACKGROUND_VALUE } from '../../common/constants';

define(User, (faker: Faker) => {
  const user = new User();
  user.nick = faker.name.firstName();
  user.avatar = '';
  user.background = Math.floor(Math.random() * MAX_BACKGROUND_VALUE) + 1;
  if (!!Math.floor(Math.random() * 2)) {
    user.discord = faker.name.firstName();
  }
  if (!!Math.floor(Math.random() * 2)) {
    user.twitch = faker.name.firstName();
  }
  if (!!Math.floor(Math.random() * 2)) {
    user.youtube = faker.name.firstName();
  }
  const roles = Math.floor(Math.random() * 5);
  const shuffled = [1, 2, 3, 4].sort(() => 0.5 - Math.random());
  user.roles = shuffled.slice(0, roles).sort();
  return user;
});
