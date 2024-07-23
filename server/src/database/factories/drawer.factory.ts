import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Drawer } from '../../features/drawers/drawer.entity';

define(Drawer, (faker: Faker) => {
  const drawer = new Drawer();
  return drawer;
});
