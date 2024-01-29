import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Task } from '../../features/tasks/task.entity';
import {
  MAX_AMOUNT_VALUE,
  MAX_INTAKE_VALUE,
  MAX_ITEM_VALUE,
  MAX_KIT_VALUE,
} from '../../common/constants';

define(Task, (faker: Faker) => {
  const task = new Task();
  task.item = Math.floor(Math.random() * MAX_ITEM_VALUE) + 1;
  task.description = '';
  task.amount = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  task.intake = Math.floor(Math.random() * MAX_INTAKE_VALUE) + 1;
  task.kit = Math.floor(Math.random() * MAX_KIT_VALUE) + 1;
  task.price = Math.floor(Math.random() * 200) + 1;
  task.status = Math.floor(Math.random() * 4) + 1;
  return task;
});
