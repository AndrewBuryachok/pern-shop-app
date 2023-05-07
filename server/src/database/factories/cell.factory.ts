import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Cell } from '../../features/cells/cell.entity';

define(Cell, (faker: Faker) => {
  const cell = new Cell();
  return cell;
});
