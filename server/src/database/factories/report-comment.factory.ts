import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { ReportComment } from '../../features/reports/comment.entity';

define(ReportComment, (faker: Faker) => {
  const comment = new ReportComment();
  comment.text = faker.lorem.sentence(7);
  return comment;
});
