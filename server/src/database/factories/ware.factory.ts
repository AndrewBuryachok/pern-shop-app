import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Ware } from '../../features/wares/ware.entity';
import {
  MAX_AMOUNT_VALUE,
  MAX_ITEM_VALUE,
  MAX_KIT_VALUE,
} from '../../common/constants';

define(Ware, (faker: Faker) => {
  const ware = new Ware();
  ware.item = Math.floor(Math.random() * MAX_ITEM_VALUE) + 1;
  ware.description = '-';
  ware.amount = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  ware.intake = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  ware.kit = Math.floor(Math.random() * MAX_KIT_VALUE) + 1;
  ware.price = Math.floor(Math.random() * 200) + 1;
  if (Math.random() > 0.8) {
    ware.completedAt = new Date();
  }
  return ware;
});
