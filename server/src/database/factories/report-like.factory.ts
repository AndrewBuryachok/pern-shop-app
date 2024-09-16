import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { ReportLike } from '../../features/reports/report-like.entity';

define(ReportLike, (faker: Faker) => {
  const like = new ReportLike();
  like.type = !!Math.floor(Math.random() * 2);
  return like;
});
