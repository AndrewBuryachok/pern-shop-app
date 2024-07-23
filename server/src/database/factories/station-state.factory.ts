import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { StationState } from '../../features/stations/station-state.entity';

define(StationState, (faker: Faker) => {
  const stationState = new StationState();
  return stationState;
});
