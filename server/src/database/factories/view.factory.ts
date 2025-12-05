import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { View } from '../../features/articles/view.entity';

define(View, (faker: Faker) => {
  const view = new View();
  return view;
});
