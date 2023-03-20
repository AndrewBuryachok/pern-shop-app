import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Card } from '../../features/cards/card.entity';

define(Card, (faker: Faker) => {
  const card = new Card();
  card.name = faker.lorem.word();
  card.color = Math.floor(Math.random() * 5) + 1;
  card.balance = Math.floor(Math.random() * 1000);
  return card;
});
