import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Article } from '../../features/articles/article.entity';

define(Article, (faker: Faker) => {
  const article = new Article();
  article.text = faker.lorem.sentence(7);
  article.image = '';
  return article;
});
