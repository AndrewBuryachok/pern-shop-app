import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Plaint } from '../../features/plaints/plaint.entity';

define(Plaint, (faker: Faker) => {
  const plaint = new Plaint();
  plaint.title = faker.lorem.sentence(3);
  const completed = !!Math.floor(Math.random() * 2);
  if (completed) {
    plaint.text = faker.lorem.sentence(7);
    plaint.completedAt = new Date();
  }
  return plaint;
});
