import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Article } from '../../features/articles/article.entity';

define(Article, (faker: Faker) => {
  const article = new Article();
  article.text = faker.lorem.sentence(7);
  article.image1 = `https://picsum.photos/seed/${faker.lorem.word()}/960/480`;
  article.image2 = '';
  article.image3 = '';
  return article;
});
