import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Card } from '../../features/cards/card.entity';

define(Card, (faker: Faker) => {
  const card = new Card();
  return card;
});
