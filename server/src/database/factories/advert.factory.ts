import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Advert } from '../../features/adverts/advert.entity';

define(Advert, (faker: Faker) => {
  const advert = new Advert();
  advert.activity = faker.lorem.sentence(1);
  advert.text = faker.lorem.sentence(7);
  advert.price = Math.floor(Math.random() * 200) + 1;
  return advert;
});
