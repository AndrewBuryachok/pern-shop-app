import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { ArticleLike } from '../../features/articles/article-like.entity';

define(ArticleLike, (faker: Faker) => {
  const like = new ArticleLike();
  like.type = !!Math.floor(Math.random() * 2);
  return like;
});
