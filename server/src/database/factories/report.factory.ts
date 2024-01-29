import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Report } from '../../features/reports/report.entity';

define(Report, (faker: Faker) => {
  const report = new Report();
  report.text = faker.lorem.sentence(7);
  report.image1 = `https://picsum.photos/seed/${faker.lorem.word()}/960/480`;
  report.image2 = '';
  report.image3 = '';
  report.video = '';
  report.mark = Math.floor(Math.random() * 5) + 1;
  return report;
});
