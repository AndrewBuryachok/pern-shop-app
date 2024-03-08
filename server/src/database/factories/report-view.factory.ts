import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { ReportView } from '../../features/reports/report-view.entity';

define(ReportView, (faker: Faker) => {
  const view = new ReportView();
  return view;
});
