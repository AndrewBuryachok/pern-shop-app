import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Annotation } from '../../features/annotations/annotation.entity';

define(Annotation, (faker: Faker) => {
  const annotation = new Annotation();
  annotation.text = faker.lorem.sentence(7);
  return annotation;
});
