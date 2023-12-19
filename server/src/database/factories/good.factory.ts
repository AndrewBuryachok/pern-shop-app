import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Good } from '../../features/goods/good.entity';
import {
  MAX_AMOUNT_VALUE,
  MAX_INTAKE_VALUE,
  MAX_ITEM_VALUE,
  MAX_KIT_VALUE,
} from '../../common/constants';

define(Good, (faker: Faker) => {
  const good = new Good();
  good.item = Math.floor(Math.random() * MAX_ITEM_VALUE) + 1;
  good.description = '';
  good.amount = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  good.intake = Math.floor(Math.random() * MAX_INTAKE_VALUE) + 1;
  good.kit = Math.floor(Math.random() * MAX_KIT_VALUE) + 1;
  good.price = Math.floor(Math.random() * 200) + 1;
  return good;
});
