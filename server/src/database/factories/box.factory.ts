import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Box } from '../../features/boxes/box.entity';

define(Box, (faker: Faker) => {
  const box = new Box();
  return box;
});
