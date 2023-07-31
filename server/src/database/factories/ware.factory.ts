import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Ware } from '../../features/wares/ware.entity';

define(Ware, (faker: Faker) => {
  const ware = new Ware();
  ware.item = Math.floor(Math.random() * 1418) + 1;
  ware.description = '-';
  ware.amount = Math.floor(Math.random() * 27) + 1;
  ware.intake = Math.floor(Math.random() * 64) + 1;
  ware.kit = Math.floor(Math.random() * 3) + 1;
  ware.price = Math.floor(Math.random() * 200) + 1;
  return ware;
});
