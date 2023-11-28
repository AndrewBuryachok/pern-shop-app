import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Task } from '../../features/tasks/task.entity';
import { MAX_PRIORITY_VALUE } from '../../common/constants';

define(Task, (faker: Faker) => {
  const task = new Task();
  task.description = faker.lorem.sentence(3);
  task.priority = Math.floor(Math.random() * MAX_PRIORITY_VALUE) + 1;
  task.status = Math.floor(Math.random() * 4) + 1;
  return task;
});
