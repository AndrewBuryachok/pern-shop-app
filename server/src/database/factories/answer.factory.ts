import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Answer } from '../../features/answers/answer.entity';

define(Answer, (faker: Faker) => {
  const answer = new Answer();
  answer.text = faker.lorem.sentence(7);
  return answer;
});
