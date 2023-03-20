import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Cell } from '../../features/cells/cell.entity';

define(Cell, (faker: Faker) => {
  const cell = new Cell();
  const reserved = !!Math.floor(Math.random() * 2);
  if (reserved) {
    cell.reservedAt = new Date();
  }
  return cell;
});
