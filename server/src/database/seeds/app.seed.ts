import { faker } from '@faker-js/faker';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { Article } from '../../features/articles/article.entity';
import { Like } from '../../features/articles/like.entity';
import { Comment } from '../../features/comments/comment.entity';
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
import { Lot } from '../../features/lots/lot.entity';
import { Order } from '../../features/orders/order.entity';
import { Delivery } from '../../features/deliveries/delivery.entity';
import { Trade } from '../../features/trades/trade.entity';
import { Sale } from '../../features/sales/sale.entity';
import { Bid } from '../../features/bids/bid.entity';
import { Task } from '../../features/tasks/task.entity';
import { Plaint } from '../../features/plaints/plaint.entity';
import { Poll } from '../../features/polls/poll.entity';
import { Vote } from '../../features/polls/vote.entity';
import { Discussion } from '../../features/discussions/discussion.entity';
import { Rating } from '../../features/ratings/rating.entity';
import { Status } from '../../features/transportations/status.enum';
import { Kind } from '../../features/leases/kind.enum';
import { getDateWeekAfter, hashData } from '../../common/utils';

export default class AppSeed implements Seeder {
  public async run(factory: Factory) {
    const users = await factory(User)()
      .map(async (user) => {
        user.password = await hashData(user.nick);
        return user;
      })
      .createMany(20);
    const articles = await factory(Article)()
      .map(async (article) => {
        article.user = faker.helpers.arrayElement(users);
        return article;
      })
      .createMany(20);
    const allLikes = articles.reduce(
      (prev, article) => [...prev, ...users.map((user) => ({ article, user }))],
      [],
    );
    const randomLikes = [...Array(allLikes.length).keys()];
    randomLikes.sort(() => Math.random() - 0.5);
    let likeId = 0;
    const likes = await factory(Like)()
      .map(async (like) => {
        like.article = allLikes[randomLikes[likeId]].article;
        like.user = allLikes[randomLikes[likeId]].user;
        likeId++;
        return like;
      })
      .createMany(80);
    const comments = await factory(Comment)()
      .map(async (comment) => {
        comment.article = faker.helpers.arrayElement(articles);
        comment.user = faker.helpers.arrayElement(users);
        return comment;
      })
      .createMany(40);
    const cards = await factory(Card)()
      .map(async (card) => {
        const count = Math.floor(Math.random() * 2) + 1;
        const shuffled = users.sort(() => 0.5 - Math.random());
        card.users = shuffled.slice(0, count);
        card.user = card.users[0];
        return card;
      })
      .makeMany(40);
    const exchanges = await factory(Exchange)()
      .map(async (exchange) => {
        exchange.executorUser = faker.helpers.arrayElement(users);
        exchange.customerCard = faker.helpers.arrayElement(
          cards.filter((card) => exchange.type || card.balance >= exchange.sum),
        );
        if (exchange.type) {
          exchange.customerCard.balance += exchange.sum;
        } else {
          exchange.customerCard.balance -= exchange.sum;
        }
        return exchange;
      })
      .makeMany(40);
    const payments = await factory(Payment)()
      .map(async (payment) => {
        payment.senderCard = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= payment.sum),
        );
        payment.receiverCard = faker.helpers.arrayElement(cards);
        payment.senderCard.balance -= payment.sum;
        payment.receiverCard.balance += payment.sum;
        return payment;
      })
      .makeMany(40);
    const invoices = await factory(Invoice)()
      .map(async (invoice) => {
        const completed = !!Math.floor(Math.random() * 2);
        invoice.senderCard = faker.helpers.arrayElement(cards);
        invoice.receiverUser = faker.helpers.arrayElement(users);
        if (completed) {
          invoice.receiverCard = faker.helpers.arrayElement(
            cards.filter((card) => card.balance >= invoice.sum),
          );
          invoice.receiverUser = invoice.receiverCard.user;
          invoice.completedAt = new Date();
          const payment = await factory(Payment)().make({
            senderCard: invoice.receiverCard,
            receiverCard: invoice.senderCard,
            sum: invoice.sum,
            description: '',
          });
          payments.push(payment);
          invoice.receiverCard.balance -= invoice.sum;
          invoice.senderCard.balance += invoice.sum;
        }
        return invoice;
      })
      .makeMany(20);
    let citizens = users.sort(() => 0.5 - Math.random());
    const cities = await factory(City)()
      .map(async (city) => {
        const count = Math.floor(Math.random() * 2) + 1;
        city.users = citizens.slice(0, count);
        city.user = city.users[0];
        citizens = citizens.slice(count);
        return city;
      })
      .createMany(10);
    const shops = await factory(Shop)()
      .map(async (shop) => {
        const count = Math.floor(Math.random() * 2) + 1;
        const shuffled = users.sort(() => 0.5 - Math.random());
        shop.users = shuffled.slice(0, count);
        shop.user = shop.users[0];
        return shop;
      })
      .createMany(10);
    const markets = await factory(Market)()
      .map(async (market) => {
        market.card = faker.helpers.arrayElement(cards);
        market.stores = [];
        return market;
      })
      .makeMany(10);
    let marketId = 0;
    const marketsStates = await factory(MarketState)()
      .map(async (marketState) => {
        marketState.market = markets[marketId++];
        marketState.price = marketState.market.price;
        return marketState;
      })
      .makeMany(markets.length);
    const storages = await factory(Storage)()
      .map(async (storage) => {
        storage.card = faker.helpers.arrayElement(cards);
        storage.cells = [];
        return storage;
      })
      .makeMany(10);
    let storageId = 0;
    const storagesStates = await factory(StorageState)()
      .map(async (storageState) => {
        storageState.storage = storages[storageId++];
        storageState.price = storageState.storage.price;
        return storageState;
      })
      .makeMany(storages.length);
    const stores = await factory(Store)()
      .map(async (store) => {
        store.market = faker.helpers.arrayElement(markets);
        store.market.stores.push(store);
        store.name = store.market.stores.length;
        return store;
      })
      .makeMany(40);
    const cells = await factory(Cell)()
      .map(async (cell) => {
        cell.storage = faker.helpers.arrayElement(storages);
        cell.storage.cells.push(cell);
        cell.name = cell.storage.cells.length;
        return cell;
      })
      .makeMany(60);
    const rents = await factory(Rent)()
      .map(async (rent) => {
        rent.store = faker.helpers.arrayElement(
          stores.filter((store) => !store.reservedUntil),
        );
        rent.store.reservedUntil = getDateWeekAfter();
        rent.card = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= rent.store.market.price),
        );
        const payment = await factory(Payment)().make({
          senderCard: rent.card,
          receiverCard: rent.store.market.card,
          sum: rent.store.market.price,
          description: '',
        });
        payments.push(payment);
        rent.card.balance -= rent.store.market.price;
        rent.store.market.card.balance += rent.store.market.price;
        return rent;
      })
      .makeMany(10);
    const leases = await factory(Lease)()
      .map(async (lease) => {
        lease.cell = faker.helpers.arrayElement(
          cells.filter((cell) => !cell.reservedUntil),
        );
        lease.cell.reservedUntil = getDateWeekAfter();
        lease.card = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= lease.cell.storage.price),
        );
        const payment = await factory(Payment)().make({
          senderCard: lease.card,
          receiverCard: lease.cell.storage.card,
          sum: lease.cell.storage.price,
          description: '',
        });
        payments.push(payment);
        lease.card.balance -= lease.cell.storage.price;
        lease.cell.storage.card.balance += lease.cell.storage.price;
        return lease;
      })
      .makeMany(50);
    const goods = await factory(Good)()
      .map(async (good) => {
        good.shop = faker.helpers.arrayElement(shops);
        return good;
      })
      .createMany(20);
    const wares = await factory(Ware)()
      .map(async (ware) => {
        ware.rent = faker.helpers.arrayElement(rents);
        return ware;
      })
      .makeMany(20);
    let wareId = 0;
    const waresStates = await factory(WareState)()
      .map(async (wareState) => {
        wareState.ware = wares[wareId++];
        wareState.price = wareState.ware.price;
        return wareState;
      })
      .makeMany(wares.length);
    let leaseId = 0;
    const products = await factory(Product)()
      .map(async (product) => {
        product.lease = leases[leaseId++];
        product.lease.kind = Kind.PRODUCT;
        return product;
      })
      .makeMany(10);
    let productId = 0;
    const productsStates = await factory(ProductState)()
      .map(async (productState) => {
        productState.product = products[productId++];
        productState.price = productState.product.price;
        return productState;
      })
      .makeMany(products.length);
    const lots = await factory(Lot)()
      .map(async (lot) => {
        lot.lease = leases[leaseId++];
        lot.lease.kind = Kind.LOT;
        return lot;
      })
      .makeMany(10);
    const orders = await factory(Order)()
      .map(async (order) => {
        order.lease = leases[leaseId++];
        order.lease.kind = Kind.ORDER;
        order.lease.card.balance -= order.price;
        if (order.status !== Status.CREATED) {
          order.executorCard = faker.helpers.arrayElement(cards);
        }
        if (order.status === Status.COMPLETED) {
          order.completedAt = new Date();
          const payment = await factory(Payment)().make({
            senderCard: order.lease.card,
            receiverCard: order.executorCard,
            sum: order.price,
            description: '',
          });
          payments.push(payment);
          order.executorCard.balance += order.price;
        }
        return order;
      })
      .makeMany(10);
    const deliveries = await factory(Delivery)()
      .map(async (delivery) => {
        delivery.fromLease = leases[leaseId++];
        delivery.fromLease.kind = Kind.DELIVERY;
        delivery.toLease = leases[leaseId++];
        delivery.toLease.kind = Kind.DELIVERY;
        delivery.fromLease.card.balance -= delivery.price;
        if (delivery.status !== Status.CREATED) {
          delivery.executorCard = faker.helpers.arrayElement(cards);
        }
        if (delivery.status === Status.COMPLETED) {
          delivery.completedAt = new Date();
          const payment = await factory(Payment)().make({
            senderCard: delivery.fromLease.card,
            receiverCard: delivery.executorCard,
            sum: delivery.price,
            description: '',
          });
          payments.push(payment);
          delivery.executorCard.balance += delivery.price;
        }
        return delivery;
      })
      .makeMany(10);
    const trades = await factory(Trade)()
      .map(async (trade) => {
        trade.ware = faker.helpers.arrayElement(
          wares.filter((ware) => ware.amount),
        );
        trade.card = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= trade.ware.price),
        );
        trade.amount =
          Math.floor(
            Math.random() *
              Math.min(
                trade.ware.amount,
                Math.floor(trade.card.balance / trade.ware.price),
              ),
          ) + 1;
        trade.ware.amount -= trade.amount;
        const payment = await factory(Payment)().make({
          senderCard: trade.card,
          receiverCard: trade.ware.rent.card,
          sum: trade.amount * trade.ware.price,
          description: '',
        });
        payments.push(payment);
        trade.card.balance -= trade.amount * trade.ware.price;
        trade.ware.rent.card.balance += trade.amount * trade.ware.price;
        return trade;
      })
      .makeMany(20);
    const sales = await factory(Sale)()
      .map(async (sale) => {
        sale.product = faker.helpers.arrayElement(
          products.filter((product) => product.amount),
        );
        sale.card = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= sale.product.price),
        );
        sale.amount =
          Math.floor(
            Math.random() *
              Math.min(
                sale.product.amount,
                Math.floor(sale.card.balance / sale.product.price),
              ),
          ) + 1;
        sale.product.amount -= sale.amount;
        const payment = await factory(Payment)().make({
          senderCard: sale.card,
          receiverCard: sale.product.lease.card,
          sum: sale.amount * sale.product.price,
          description: '',
        });
        payments.push(payment);
        sale.card.balance -= sale.amount * sale.product.price;
        sale.product.lease.card.balance += sale.amount * sale.product.price;
        return sale;
      })
      .makeMany(20);
    const bids = await factory(Bid)()
      .map(async (bid) => {
        bid.lot = faker.helpers.arrayElement(lots);
        bid.price = Math.floor(Math.random() * 200) + bid.lot.price;
        bid.lot.price = bid.price;
        bid.card = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= bid.lot.price),
        );
        bid.card.balance -= bid.lot.price;
        return bid;
      })
      .makeMany(20);
    const tasks = await factory(Task)()
      .map(async (task) => {
        task.customerUser = faker.helpers.arrayElement(users);
        if (task.status !== Status.CREATED) {
          task.executorUser = faker.helpers.arrayElement(users);
        }
        if (task.status === Status.COMPLETED) {
          task.completedAt = new Date();
        }
        return task;
      })
      .createMany(40);
    const plaints = await factory(Plaint)()
      .map(async (plaint) => {
        plaint.senderUser = faker.helpers.arrayElement(users);
        plaint.receiverUser = faker.helpers.arrayElement(users);
        if (plaint.completedAt) {
          plaint.executorUser = faker.helpers.arrayElement(users);
        }
        return plaint;
      })
      .createMany(20);
    const polls = await factory(Poll)()
      .map(async (poll) => {
        poll.user = faker.helpers.arrayElement(users);
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
    const discussions = await factory(Discussion)()
      .map(async (discussion) => {
        discussion.poll = faker.helpers.arrayElement(polls);
        discussion.user = faker.helpers.arrayElement(users);
        return discussion;
      })
      .createMany(40);
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
    let id = 0;
    await factory(Card)()
      .map(async () => cards[id++])
      .createMany(cards.length);
    id = 0;
    await factory(Exchange)()
      .map(async () => exchanges[id++])
      .createMany(exchanges.length);
    id = 0;
    await factory(Payment)()
      .map(async () => payments[id++])
      .createMany(payments.length);
    id = 0;
    await factory(Invoice)()
      .map(async () => invoices[id++])
      .createMany(invoices.length);
    id = 0;
    await factory(Market)()
      .map(async () => markets[id++])
      .createMany(markets.length);
    id = 0;
    await factory(MarketState)()
      .map(async () => marketsStates[id++])
      .createMany(marketsStates.length);
    id = 0;
    await factory(Storage)()
      .map(async () => storages[id++])
      .createMany(storages.length);
    id = 0;
    await factory(StorageState)()
      .map(async () => storagesStates[id++])
      .createMany(storagesStates.length);
    id = 0;
    await factory(Store)()
      .map(async () => stores[id++])
      .createMany(stores.length);
    id = 0;
    await factory(Cell)()
      .map(async () => cells[id++])
      .createMany(cells.length);
    id = 0;
    await factory(Rent)()
      .map(async () => rents[id++])
      .createMany(rents.length);
    id = 0;
    await factory(Lease)()
      .map(async () => leases[id++])
      .createMany(leases.length);
    id = 0;
    await factory(Ware)()
      .map(async () => wares[id++])
      .createMany(wares.length);
    id = 0;
    await factory(WareState)()
      .map(async () => waresStates[id++])
      .createMany(waresStates.length);
    id = 0;
    await factory(Product)()
      .map(async () => products[id++])
      .createMany(products.length);
    id = 0;
    await factory(ProductState)()
      .map(async () => productsStates[id++])
      .createMany(productsStates.length);
    id = 0;
    await factory(Lot)()
      .map(async () => lots[id++])
      .createMany(lots.length);
    id = 0;
    await factory(Order)()
      .map(async () => orders[id++])
      .createMany(orders.length);
    id = 0;
    await factory(Delivery)()
      .map(async () => deliveries[id++])
      .createMany(deliveries.length);
    id = 0;
    await factory(Trade)()
      .map(async () => trades[id++])
      .createMany(trades.length);
    id = 0;
    await factory(Sale)()
      .map(async () => sales[id++])
      .createMany(sales.length);
    id = 0;
    await factory(Bid)()
      .map(async () => bids[id++])
      .createMany(bids.length);
  }
}
