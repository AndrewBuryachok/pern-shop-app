import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Haulage } from '../../features/haulages/haulage.entity';
import { Status } from '../../features/transportations/status.enum';
import {
  MAX_AMOUNT_VALUE,
  MAX_INTAKE_VALUE,
  MAX_ITEM_VALUE,
  MAX_KIT_VALUE,
  MAX_RATE_VALUE,
} from '../../common/constants';

define(Haulage, (faker: Faker) => {
  const haulage = new Haulage();
  haulage.item = Math.floor(Math.random() * MAX_ITEM_VALUE) + 1;
  haulage.description = '';
  haulage.amount = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  haulage.intake = Math.floor(Math.random() * MAX_INTAKE_VALUE) + 1;
  haulage.kit = Math.floor(Math.random() * MAX_KIT_VALUE) + 1;
  haulage.price = Math.floor(Math.random() * 200) + 1;
  haulage.status = Math.floor(Math.random() * 4) + 1;
  if (haulage.status === Status.COMPLETED) {
    haulage.completedAt = new Date();
    if (Math.random() > 0.5) {
      haulage.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
    }
  }
  return haulage;
});
