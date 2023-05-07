import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { WareState } from '../../features/wares/ware-state.entity';

define(WareState, (faker: Faker) => {
  const wareState = new WareState();
  return wareState;
});
