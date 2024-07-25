import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { MarketDelivery } from '../../features/markets-deliveries/market-delivery.entity';
import { Status } from '../../features/transportations/status.enum';
import { MAX_RATE_VALUE } from '../../common/constants';

define(MarketDelivery, (faker: Faker) => {
  const marketDelivery = new MarketDelivery();
  marketDelivery.price = Math.floor(Math.random() * 200) + 1;
  marketDelivery.status = Math.floor(Math.random() * 4) + 1;
  if (marketDelivery.status === Status.COMPLETED) {
    marketDelivery.completedAt = new Date();
    if (Math.random() > 0.5) {
      marketDelivery.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
    }
  }
  return marketDelivery;
});
