import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { WareState } from '../../features/wares/ware-state.entity';

define(WareState, (faker: Faker) => {
  const wareState = new WareState();
  wareState.price = Math.floor(Math.random() * 200) + 1;
  return wareState;
});
