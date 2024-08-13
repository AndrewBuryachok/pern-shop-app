import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Advert } from '../../features/adverts/advert.entity';

define(Advert, (faker: Faker) => {
  const advert = new Advert();
  advert.description = '';
  advert.price = Math.floor(Math.random() * 200) + 1;
  return advert;
});
