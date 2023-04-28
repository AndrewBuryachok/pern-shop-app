import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { Card } from '../../features/cards/card.entity';
import { Exchange } from '../../features/exchanges/exchange.entity';
import { Payment } from '../../features/payments/payment.entity';
import { Invoice } from '../../features/invoices/invoice.entity';
import { City } from '../../features/cities/city.entity';
import { Shop } from '../../features/shops/shop.entity';
import { Market } from '../../features/markets/market.entity';
import { MarketState } from '../../features/markets/market-state.entity';
import { Storage } from '../../features/storages/storage.entity';
import { StorageState } from '../../features/storages/storage-state.entity';
import { Store } from '../../features/stores/store.entity';
import { Cell } from '../../features/cells/cell.entity';
import { Rent } from '../../features/rents/rent.entity';
import { Lease } from '../../features/leases/lease.entity';
import { Good } from '../../features/goods/good.entity';
import { Ware } from '../../features/wares/ware.entity';
import { WareState } from '../../features/wares/ware-state.entity';
import { Product } from '../../features/products/product.entity';
import { ProductState } from '../../features/products/product-state.entity';
import { Order } from '../../features/orders/order.entity';
import { Delivery } from '../../features/deliveries/delivery.entity';
import { Trade } from '../../features/trades/trade.entity';
import { Sale } from '../../features/sales/sale.entity';
import { Poll } from '../../features/polls/poll.entity';
import { Vote } from '../../features/votes/vote.entity';
import { Friend } from '../../features/friends/friend.entity';
import { Rating } from '../../features/ratings/rating.entity';
import { TransportationStatus } from '../../features/transportations/transportation-status.enum';
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
    let marketId = 0;
    const marketsStates = await factory(MarketState)()
      .map(async (marketState) => {
        marketState.market = markets[Math.floor(marketId / 2)];
        if (marketId % 2) {
          marketState.price = marketState.market.price;
        }
        marketId++;
        return marketState;
      })
      .createMany(20);
    const storages = await factory(Storage)()
      .map(async (storage) => {
        storage.card = cards[Math.floor(Math.random() * cards.length)];
        storage.cells = [];
        return storage;
      })
      .createMany(10);
    let storageId = 0;
    const storagesStates = await factory(StorageState)()
      .map(async (storageState) => {
        storageState.storage = storages[Math.floor(storageId / 2)];
        if (storageId % 2) {
          storageState.price = storageState.storage.price;
        }
        storageId++;
        return storageState;
      })
      .createMany(20);
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
    const leases = await factory(Lease)()
      .map(async (lease) => {
        lease.cell = cells[Math.floor(Math.random() * cells.length)];
        lease.card = cards[Math.floor(Math.random() * cards.length)];
        return lease;
      })
      .createMany(400);
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
    let wareId = 1;
    const waresStates = await factory(WareState)()
      .map(async (wareState) => {
        wareState.ware = wares[wareId - Math.floor(wareId / 5) - 1];
        if (wareId % 5 !== 4) {
          wareState.price = wareState.ware.price;
        }
        wareId++;
        return wareState;
      })
      .createMany(200);
    let leaseId = 0;
    const products = await factory(Product)()
      .map(async (product) => {
        product.lease = leases[leaseId];
        leaseId++;
        return product;
      })
      .createMany(160);
    let productId = 1;
    const productsStates = await factory(ProductState)()
      .map(async (productState) => {
        productState.product =
          products[productId - Math.floor(productId / 5) - 1];
        if (productId % 5 !== 4) {
          productState.price = productState.product.price;
        }
        productId++;
        return productState;
      })
      .createMany(200);
    const orders = await factory(Order)()
      .map(async (order) => {
        order.lease = leases[leaseId];
        leaseId++;
        if (order.status !== TransportationStatus.CREATED) {
          order.executorCard = cards[Math.floor(Math.random() * cards.length)];
        }
        if (order.status === TransportationStatus.COMPLETED) {
          order.completedAt = new Date();
        }
        return order;
      })
      .createMany(80);
    const deliveries = await factory(Delivery)()
      .map(async (delivery) => {
        delivery.fromLease = leases[leaseId];
        leaseId++;
        delivery.toLease = leases[leaseId];
        leaseId++;
        delivery.receiverUser = users[Math.floor(Math.random() * users.length)];
        if (delivery.status !== TransportationStatus.CREATED) {
          delivery.executorCard =
            cards[Math.floor(Math.random() * cards.length)];
        }
        if (delivery.status === TransportationStatus.COMPLETED) {
          delivery.completedAt = new Date();
        }
        return delivery;
      })
      .createMany(80);
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
    const allVotes = polls.reduce(
      (prev, poll) => [...prev, ...users.map((user) => ({ poll, user }))],
      [],
    );
    const randomVotes = [...Array(allVotes.length).keys()];
    randomVotes.sort(() => Math.random() - 0.5);
    let voteId = 0;
    const votes = await factory(Vote)()
      .map(async (vote) => {
        vote.poll = allVotes[randomVotes[voteId]].poll;
        vote.user = allVotes[randomVotes[voteId]].user;
        voteId++;
        return vote;
      })
      .createMany(80);
    const allFriends = users.reduce(
      (prev, senderUser) => [
        ...prev,
        ...users.map((receiverUser) => ({ senderUser, receiverUser })),
      ],
      [],
    );
    const randomFriends = [...Array(allFriends.length).keys()];
    randomFriends.sort(() => Math.random() - 0.5);
    let friendId = 0;
    const friends = await factory(Friend)()
      .map(async (friend) => {
        friend.senderUser = allFriends[randomFriends[friendId]].senderUser;
        friend.receiverUser = allFriends[randomFriends[friendId]].receiverUser;
        friend.type =
          friend.type || friend.senderUser.id === friend.receiverUser.id;
        friendId++;
        return friend;
      })
      .createMany(80);
    const allRatings = users.reduce(
      (prev, senderUser) => [
        ...prev,
        ...users.map((receiverUser) => ({ senderUser, receiverUser })),
      ],
      [],
    );
    const randomRatings = [...Array(allRatings.length).keys()];
    randomRatings.sort(() => Math.random() - 0.5);
    let ratingId = 0;
    const ratings = await factory(Rating)()
      .map(async (rating) => {
        rating.senderUser = allRatings[randomRatings[ratingId]].senderUser;
        rating.receiverUser = allRatings[randomRatings[ratingId]].receiverUser;
        ratingId++;
        return rating;
      })
      .createMany(80);
  }
}
