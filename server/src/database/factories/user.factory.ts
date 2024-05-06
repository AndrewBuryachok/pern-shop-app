import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { MAX_BACKGROUND_VALUE, MAX_ROLE_VALUE } from '../../common/constants';

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
  user.roles = [Math.floor(Math.random() * MAX_ROLE_VALUE) + 1];
  return user;
});
