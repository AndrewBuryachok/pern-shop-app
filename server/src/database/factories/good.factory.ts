import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Good } from '../../features/goods/good.entity';
import { MAX_AMOUNT_VALUE, MAX_KIT_VALUE } from '../../common/constants';
import { Item } from '../../features/things/item.enum';

define(Good, () => {
  const good = new Good();
  good.item = faker.helpers.arrayElement(Object.values(Item));
  good.description = '';
  good.amount = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  good.kit = Math.floor(Math.random() * MAX_KIT_VALUE) + 1;
  good.intake =
    good.kit !== 1 ? 1 : faker.helpers.arrayElement([1, 16, 32, 64]);
  good.price = Math.floor(Math.random() * 200) + 1;
  if (Math.random() > 0.8) {
    good.completedAt = new Date();
  }
  return good;
});
