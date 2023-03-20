import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { Card } from '../../features/cards/card.entity';
import { Exchange } from '../../features/exchanges/exchange.entity';
import { Payment } from '../../features/payments/payment.entity';
import { Invoice } from '../../features/invoices/invoice.entity';
import { City } from '../../features/cities/city.entity';
import { Shop } from '../../features/shops/shop.entity';
import { Market } from '../../features/markets/market.entity';
import { Storage } from '../../features/storages/storage.entity';
import { Store } from '../../features/stores/store.entity';
import { Cell } from '../../features/cells/cell.entity';
import { Rent } from '../../features/rents/rent.entity';
import { Good } from '../../features/goods/good.entity';
import { Ware } from '../../features/wares/ware.entity';
import { Product } from '../../features/products/product.entity';
import { Trade } from '../../features/trades/trade.entity';
import { Sale } from '../../features/sales/sale.entity';
import { Poll } from '../../features/polls/poll.entity';
import { Vote } from '../../features/votes/vote.entity';
import { hashData } from '../../common/utils';

export default class AppSeed implements Seeder {
  public async run(factory: Factory) {
    const users = await factory(User)()
      .map(async (user) => {
        user.password = await hashData(user.name);
        return user;
      })
      .createMany(10);
    const cities = await factory(City)()
      .map(async (city) => {
        city.users = await factory(User)()
          .map(async (user) => {
            user.password = await hashData(user.name);
            return user;
          })
          .createMany(Math.floor(Math.random() * 4) + 1);
        city.user = city.users[0];
        users.push(...city.users);
        return city;
      })
      .createMany(10);
    const cards = await factory(Card)()
      .map(async (card) => {
        card.user = users[Math.floor(Math.random() * users.length)];
        return card;
      })
      .createMany(40);
    const exchanges = await factory(Exchange)()
      .map(async (exchange) => {
        exchange.executorUser = users[Math.floor(Math.random() * users.length)];
        exchange.customerCard = cards[Math.floor(Math.random() * cards.length)];
        return exchange;
      })
      .createMany(80);
    const payments = await factory(Payment)()
      .map(async (payment) => {
        payment.senderCard = cards[Math.floor(Math.random() * cards.length)];
        payment.receiverCard = cards[Math.floor(Math.random() * cards.length)];
        return payment;
      })
      .createMany(240);
    const invoices = await factory(Invoice)()
      .map(async (invoice) => {
        const completed = !!Math.floor(Math.random() * 2);
        invoice.senderCard = cards[Math.floor(Math.random() * cards.length)];
        invoice.receiverUser = users[Math.floor(Math.random() * users.length)];
        if (completed) {
          invoice.receiverCard =
            cards[Math.floor(Math.random() * cards.length)];
          invoice.receiverUser = invoice.receiverCard.user;
          invoice.completedAt = new Date();
        }
        return invoice;
      })
      .createMany(40);
    const shops = await factory(Shop)()
      .map(async (shop) => {
        shop.user = users[Math.floor(Math.random() * users.length)];
        return shop;
      })
      .createMany(10);
    const markets = await factory(Market)()
      .map(async (market) => {
        market.card = cards[Math.floor(Math.random() * cards.length)];
        market.stores = [];
        return market;
      })
      .createMany(10);
    const storages = await factory(Storage)()
      .map(async (storage) => {
        storage.card = cards[Math.floor(Math.random() * cards.length)];
        storage.cells = [];
        return storage;
      })
      .createMany(10);
    const stores = await factory(Store)()
      .map(async (store) => {
        store.market = markets[Math.floor(Math.random() * markets.length)];
        store.market.stores.push(store);
        store.name = store.market.stores.length;
        return store;
      })
      .createMany(40);
    const cells = await factory(Cell)()
      .map(async (cell) => {
        cell.storage = storages[Math.floor(Math.random() * storages.length)];
        cell.storage.cells.push(cell);
        cell.name = cell.storage.cells.length;
        return cell;
      })
      .createMany(40);
    const rents = await factory(Rent)()
      .map(async (rent) => {
        rent.store = stores[Math.floor(Math.random() * stores.length)];
        rent.card = cards[Math.floor(Math.random() * cards.length)];
        return rent;
      })
      .createMany(80);
    const goods = await factory(Good)()
      .map(async (good) => {
        good.shop = shops[Math.floor(Math.random() * shops.length)];
        return good;
      })
      .createMany(160);
    const wares = await factory(Ware)()
      .map(async (ware) => {
        ware.rent = rents[Math.floor(Math.random() * rents.length)];
        return ware;
      })
      .createMany(160);
    const products = await factory(Product)()
      .map(async (product) => {
        product.cell = cells[Math.floor(Math.random() * cells.length)];
        product.card = cards[Math.floor(Math.random() * cards.length)];
        return product;
      })
      .createMany(160);
    const trades = await factory(Trade)()
      .map(async (trade) => {
        trade.ware = wares[Math.floor(Math.random() * wares.length)];
        trade.card = cards[Math.floor(Math.random() * cards.length)];
        return trade;
      })
      .createMany(240);
    const sales = await factory(Sale)()
      .map(async (sale) => {
        sale.product = products[Math.floor(Math.random() * products.length)];
        sale.card = cards[Math.floor(Math.random() * cards.length)];
        return sale;
      })
      .createMany(240);
    const polls = await factory(Poll)()
      .map(async (poll) => {
        poll.user = users[Math.floor(Math.random() * users.length)];
        return poll;
      })
      .createMany(10);
    const votes = await factory(Vote)()
      .map(async (vote) => {
        vote.poll = polls[Math.floor(Math.random() * polls.length)];
        vote.user = users[Math.floor(Math.random() * users.length)];
        return vote;
      })
      .createMany(80);
  }
}
