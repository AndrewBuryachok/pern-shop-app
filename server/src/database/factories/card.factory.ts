import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Card } from '../../features/cards/card.entity';
import { MAX_COLOR_VALUE } from '../../common/constants';

define(Card, (faker: Faker) => {
  const card = new Card();
  card.name = faker.finance.account(4);
  card.color = Math.floor(Math.random() * MAX_COLOR_VALUE) + 1;
  card.balance = 0;
  return card;
});
