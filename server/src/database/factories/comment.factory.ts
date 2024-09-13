import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Comment } from '../../features/articles/comment.entity';

define(Comment, (faker: Faker) => {
  const comment = new Comment();
  comment.text = faker.lorem.sentence(7);
  return comment;
});
