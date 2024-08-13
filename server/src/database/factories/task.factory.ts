import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Task } from '../../features/tasks/task.entity';
import { Status } from '../../features/transportations/status.enum';
import { MAX_RATE_VALUE } from '../../common/constants';

define(Task, (faker: Faker) => {
  const task = new Task();
  task.description = '';
  task.price = Math.floor(Math.random() * 200) + 1;
  task.status = Math.floor(Math.random() * 4) + 1;
  if (task.status === Status.COMPLETED) {
    task.completedAt = new Date();
    if (Math.random() > 0.5) {
      task.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
    }
  }
  return task;
});
