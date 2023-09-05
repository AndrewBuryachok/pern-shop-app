import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Lot } from '../../features/lots/lot.entity';

define(Lot, (faker: Faker) => {
  const lot = new Lot();
  lot.item = Math.floor(Math.random() * 1418) + 1;
  lot.description = '-';
  lot.amount = Math.floor(Math.random() * 27) + 1;
  lot.intake = Math.floor(Math.random() * 64) + 1;
  lot.kit = Math.floor(Math.random() * 3) + 1;
  lot.price = Math.floor(Math.random() * 200) + 1;
  return lot;
});
