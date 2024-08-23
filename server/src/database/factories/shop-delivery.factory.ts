import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { ShopDelivery } from '../../features/shops-deliveries/shop-delivery.entity';
import { Status } from '../../features/transportations/status.enum';
import { MAX_RATE_VALUE } from '../../common/constants';

define(ShopDelivery, (faker: Faker) => {
  const shopDelivery = new ShopDelivery();
  shopDelivery.price = Math.floor(Math.random() * 200) + 1;
  shopDelivery.status = Math.floor(Math.random() * 4) + 1;
  if (shopDelivery.status === Status.COMPLETED) {
    shopDelivery.completedAt = new Date();
    if (Math.random() > 0.5) {
      shopDelivery.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
    }
  }
  return shopDelivery;
});
