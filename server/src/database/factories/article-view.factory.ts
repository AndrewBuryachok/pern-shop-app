import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { ArticleView } from '../../features/articles/article-view.entity';

define(ArticleView, (faker: Faker) => {
  const view = new ArticleView();
  return view;
});
