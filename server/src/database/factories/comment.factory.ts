import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Comment } from '../../features/comments/comment.entity';

define(Comment, (faker: Faker) => {
  const comment = new Comment();
  comment.text = faker.lorem.sentence(7);
  return comment;
});
