import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Lot } from '../../features/lots/lot.entity';
import {
  MAX_AMOUNT_VALUE,
  MAX_ITEM_VALUE,
  MAX_KIT_VALUE,
} from '../../common/constants';

define(Lot, (faker: Faker) => {
  const lot = new Lot();
  lot.item = Math.floor(Math.random() * MAX_ITEM_VALUE) + 1;
  lot.description = '';
  lot.amount = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  lot.intake = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  lot.kit = Math.floor(Math.random() * MAX_KIT_VALUE) + 1;
  lot.price = Math.floor(Math.random() * 200) + 1;
  return lot;
});
