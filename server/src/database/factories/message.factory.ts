import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Message } from '../../features/messages/message.entity';

define(Message, (faker: Faker) => {
  const message = new Message();
  message.text = faker.lorem.sentence(7);
  return message;
});
