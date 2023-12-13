import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';

define(User, (faker: Faker) => {
  const user = new User();
  const name = faker.name.firstName();
  user.name = name;
  const roles = Math.floor(Math.random() * 5);
  const shuffled = [1, 2, 3, 4].sort(() => 0.5 - Math.random());
  user.roles = shuffled.slice(0, roles).sort();
  return user;
});
