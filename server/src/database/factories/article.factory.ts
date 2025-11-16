import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Article } from '../../features/articles/article.entity';
import { MAX_IMAGES_LENGTH } from '../../common/constants';

define(Article, (faker: Faker) => {
  const article = new Article();
  article.text = faker.lorem.sentence(7);
  article.images = [
    ...Array(Math.floor(Math.random() * (MAX_IMAGES_LENGTH + 1))),
  ].map(() => `https://picsum.photos/seed/${faker.lorem.word()}/960/480`);
  return article;
});
