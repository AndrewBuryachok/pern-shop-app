import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Report } from '../../features/reports/report.entity';
import { MAX_IMAGES_LENGTH } from '../../common/constants';

define(Report, (faker: Faker) => {
  const report = new Report();
  report.text = faker.lorem.sentence(7);
  report.mark = Math.floor(Math.random() * 6) + 1;
  report.images = [
    ...Array(Math.floor(Math.random() * (MAX_IMAGES_LENGTH + 1))),
  ].map(() => `https://picsum.photos/seed/${faker.lorem.word()}/960/480`);
  return report;
});
