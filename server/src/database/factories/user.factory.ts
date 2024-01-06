import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { MAX_COLOR_VALUE } from '../../common/constants';

define(User, (faker: Faker) => {
  const user = new User();
  const nick = faker.name.firstName();
  user.nick = nick;
  user.discord = nick;
  user.avatar = nick;
  user.color = Math.floor(Math.random() * MAX_COLOR_VALUE) + 1;
  const roles = Math.floor(Math.random() * 5);
  const shuffled = [1, 2, 3, 4].sort(() => 0.5 - Math.random());
  user.roles = shuffled.slice(0, roles).sort();
  return user;
});
