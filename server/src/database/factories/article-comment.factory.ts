import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { ArticleComment } from '../../features/articles/comment.entity';

define(ArticleComment, (faker: Faker) => {
  const comment = new ArticleComment();
  comment.text = faker.lorem.sentence(7);
  return comment;
});
