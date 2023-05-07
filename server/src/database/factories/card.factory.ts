import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Card } from '../../features/cards/card.entity';

define(Card, (faker: Faker) => {
  const card = new Card();
  card.name = faker.lorem.word();
  card.color = Math.floor(Math.random() * 4) + 1;
  card.balance = 0;
  return card;
});
