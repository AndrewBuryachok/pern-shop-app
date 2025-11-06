import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { Role } from '../../features/users/role.enum';
import { MAX_BACKGROUND_VALUE } from '../../common/constants';

define(User, () => {
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
  user.roles = [faker.helpers.arrayElement(Object.values(Role))];
  return user;
});
