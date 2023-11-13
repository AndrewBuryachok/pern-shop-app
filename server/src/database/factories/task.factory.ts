import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Task } from '../../features/tasks/task.entity';

define(Task, (faker: Faker) => {
  const task = new Task();
  task.description = faker.lorem.sentence(3);
  task.priority = Math.floor(Math.random() * 3) + 1;
  task.status = Math.floor(Math.random() * 4) + 1;
  return task;
});
