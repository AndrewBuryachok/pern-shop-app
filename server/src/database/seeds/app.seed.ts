import { faker } from '@faker-js/faker';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { Message } from '../../features/messages/message.entity';
import { Report } from '../../features/reports/report.entity';
import { ReportView } from '../../features/reports/report-view.entity';
import { Attitude } from '../../features/reports/attitude.entity';
import { Annotation } from '../../features/annotations/annotation.entity';
import { Article } from '../../features/articles/article.entity';
import { ArticleView } from '../../features/articles/article-view.entity';
import { Like } from '../../features/articles/like.entity';
import { Comment } from '../../features/comments/comment.entity';
import { Card } from '../../features/cards/card.entity';
import { Exchange } from '../../features/exchanges/exchange.entity';
import { Payment } from '../../features/payments/payment.entity';
import { Invoice } from '../../features/invoices/invoice.entity';
import { City } from '../../features/cities/city.entity';
import { Shop } from '../../features/shops/shop.entity';
import { Market } from '../../features/markets/market.entity';
import { Storage } from '../../features/storages/storage.entity';
import { Station } from '../../features/stations/station.entity';
import { MarketTag } from '../../features/markets-tags/market-tag.entity';
import { StorageTag } from '../../features/storages-tags/storage-tag.entity';
import { MarketTagState } from '../../features/markets-tags/market-tag-state.entity';
import { StorageTagState } from '../../features/storages-tags/storage-tag-state.entity';
import { StationState } from '../../features/stations/station-state.entity';
import { Store } from '../../features/stores/store.entity';
import { Cell } from '../../features/cells/cell.entity';
import { Drawer } from '../../features/drawers/drawer.entity';
import { Rent } from '../../features/rents/rent.entity';
import { Lease } from '../../features/leases/lease.entity';
import { Hire } from '../../features/hires/hire.entity';
import { Good } from '../../features/goods/good.entity';
import { Ware } from '../../features/wares/ware.entity';
import { WareState } from '../../features/wares/ware-state.entity';
import { Product } from '../../features/products/product.entity';
import { ProductState } from '../../features/products/product-state.entity';
import { Order } from '../../features/orders/order.entity';
import { Delivery } from '../../features/deliveries/delivery.entity';
import { Trade } from '../../features/trades/trade.entity';
import { Sale } from '../../features/sales/sale.entity';
import { MarketDelivery } from '../../features/markets-deliveries/market-delivery.entity';
import { StorageDelivery } from '../../features/storages-deliveries/storage-delivery.entity';
import { Task } from '../../features/tasks/task.entity';
import { Advert } from '../../features/adverts/advert.entity';
import { Poll } from '../../features/polls/poll.entity';
import { PollView } from '../../features/polls/poll-view.entity';
import { Vote } from '../../features/polls/vote.entity';
import { Discussion } from '../../features/discussions/discussion.entity';
import { Rating } from '../../features/ratings/rating.entity';
import { Status } from '../../features/transportations/status.enum';
import { getDateWeekAfter, hashData } from '../../common/utils';

export default class AppSeed implements Seeder {
  public async run(factory: Factory) {
    const users = await factory(User)()
      .map(async (user) => {
        user.password = await hashData(user.nick);
        return user;
      })
      .createMany(20);
    const messages = await factory(Message)()
      .map(async (message) => {
        message.chat = faker.helpers.arrayElement(users);
        message.user = faker.helpers.arrayElement(users);
        return message;
      })
      .createMany(40);
    const reports = await factory(Report)()
      .map(async (report) => {
        report.user = faker.helpers.arrayElement(users);
        return report;
      })
      .createMany(20);
    const reportsUsers = reports.reduce(
      (prev, report) => [...prev, ...users.map((user) => ({ report, user }))],
      [],
    );
    const randomReportsViews = [...Array(reportsUsers.length).keys()];
    randomReportsViews.sort(() => Math.random() - 0.5);
    let reportViewId = 0;
    await factory(ReportView)()
      .map(async (view) => {
        view.report = reportsUsers[randomReportsViews[reportViewId]].report;
        view.user = reportsUsers[randomReportsViews[reportViewId]].user;
        reportViewId++;
        return view;
      })
      .createMany(80);
    const randomAttitudes = [...Array(reportsUsers.length).keys()];
    randomAttitudes.sort(() => Math.random() - 0.5);
    let attitudeId = 0;
    const attitudes = await factory(Attitude)()
      .map(async (attitude) => {
        attitude.report = reportsUsers[randomAttitudes[attitudeId]].report;
        attitude.user = reportsUsers[randomAttitudes[attitudeId]].user;
        attitudeId++;
        return attitude;
      })
      .createMany(80);
    const annotations = await factory(Annotation)()
      .map(async (annotation) => {
        annotation.report = faker.helpers.arrayElement(reports);
        annotation.user = faker.helpers.arrayElement(users);
        return annotation;
      })
      .createMany(40);
    const articles = await factory(Article)()
      .map(async (article) => {
        article.user = faker.helpers.arrayElement(users);
        return article;
      })
      .createMany(20);
    const articlesUsers = articles.reduce(
      (prev, article) => [...prev, ...users.map((user) => ({ article, user }))],
      [],
    );
    const randomArticlesViews = [...Array(articlesUsers.length).keys()];
    randomArticlesViews.sort(() => Math.random() - 0.5);
    let articleViewId = 0;
    await factory(ArticleView)()
      .map(async (view) => {
        view.article =
          articlesUsers[randomArticlesViews[articleViewId]].article;
        view.user = articlesUsers[randomArticlesViews[articleViewId]].user;
        articleViewId++;
        return view;
      })
      .createMany(80);
    const randomLikes = [...Array(articlesUsers.length).keys()];
    randomLikes.sort(() => Math.random() - 0.5);
    let likeId = 0;
    const likes = await factory(Like)()
      .map(async (like) => {
        like.article = articlesUsers[randomLikes[likeId]].article;
        like.user = articlesUsers[randomLikes[likeId]].user;
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
        invoice.senderCard = faker.helpers.arrayElement(cards);
        invoice.receiverUser = faker.helpers.arrayElement(users);
        if (invoice.completedAt) {
          invoice.receiverCard = faker.helpers.arrayElement(
            cards.filter((card) => card.balance >= invoice.sum),
          );
          invoice.receiverUser = invoice.receiverCard.user;
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
    const storages = await factory(Storage)()
      .map(async (storage) => {
        storage.card = faker.helpers.arrayElement(cards);
        storage.cells = [];
        return storage;
      })
      .makeMany(10);
    const stations = await factory(Station)()
      .map(async (station) => {
        station.card = faker.helpers.arrayElement(cards);
        station.drawers = [];
        return station;
      })
      .makeMany(10);
    const marketsTags = await factory(MarketTag)()
      .map(async (marketTag) => {
        marketTag.market = faker.helpers.arrayElement(markets);
        return marketTag;
      })
      .makeMany(20);
    const storagesTags = await factory(StorageTag)()
      .map(async (storageTag) => {
        storageTag.storage = faker.helpers.arrayElement(storages);
        return storageTag;
      })
      .makeMany(20);
    let marketTagId = 0;
    const marketsTagsStates = await factory(MarketTagState)()
      .map(async (marketTagState) => {
        marketTagState.marketTag = marketsTags[marketTagId++];
        marketTagState.price = marketTagState.marketTag.price;
        return marketTagState;
      })
      .makeMany(marketsTags.length);
    let storageTagId = 0;
    const storagesTagsStates = await factory(StorageTagState)()
      .map(async (storageTagState) => {
        storageTagState.storageTag = storagesTags[storageTagId++];
        storageTagState.price = storageTagState.storageTag.price;
        return storageTagState;
      })
      .makeMany(storagesTags.length);
    let stationId = 0;
    const stationsStates = await factory(StationState)()
      .map(async (stationState) => {
        stationState.station = stations[stationId++];
        stationState.price = stationState.station.price;
        return stationState;
      })
      .makeMany(stations.length);
    const stores = await factory(Store)()
      .map(async (store) => {
        store.marketTag = faker.helpers.arrayElement(marketsTags);
        store.market = store.marketTag.market;
        store.market.stores.push(store);
        store.name = store.market.stores.length;
        return store;
      })
      .makeMany(40);
    const cells = await factory(Cell)()
      .map(async (cell) => {
        cell.storageTag = faker.helpers.arrayElement(storagesTags);
        cell.storage = cell.storageTag.storage;
        cell.storage.cells.push(cell);
        cell.name = cell.storage.cells.length;
        return cell;
      })
      .makeMany(40);
    const drawers = await factory(Drawer)()
      .map(async (drawer) => {
        drawer.station = faker.helpers.arrayElement(stations);
        drawer.station.drawers.push(drawer);
        drawer.name = drawer.station.drawers.length;
        return drawer;
      })
      .makeMany(60);
    const rents = await factory(Rent)()
      .map(async (rent) => {
        rent.store = faker.helpers.arrayElement(
          stores.filter((store) => !store.reservedUntil),
        );
        rent.store.reservedUntil = getDateWeekAfter();
        rent.card = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= rent.store.marketTag.price),
        );
        rent.sum = rent.store.marketTag.price;
        const payment = await factory(Payment)().make({
          senderCard: rent.card,
          receiverCard: rent.store.market.card,
          sum: rent.store.marketTag.price,
          description: '',
        });
        payments.push(payment);
        rent.card.balance -= rent.store.marketTag.price;
        rent.store.market.card.balance += rent.store.marketTag.price;
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
          cards.filter((card) => card.balance >= lease.cell.storageTag.price),
        );
        lease.sum = lease.cell.storageTag.price;
        const payment = await factory(Payment)().make({
          senderCard: lease.card,
          receiverCard: lease.cell.storage.card,
          sum: lease.cell.storageTag.price,
          description: '',
        });
        payments.push(payment);
        lease.card.balance -= lease.cell.storageTag.price;
        lease.cell.storage.card.balance += lease.cell.storageTag.price;
        return lease;
      })
      .makeMany(10);
    const hires = await factory(Hire)()
      .map(async (hire) => {
        hire.drawer = faker.helpers.arrayElement(
          drawers.filter((drawer) => !drawer.reservedUntil),
        );
        hire.drawer.reservedUntil = getDateWeekAfter();
        hire.card = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= hire.drawer.station.price),
        );
        hire.sum = hire.drawer.station.price;
        const payment = await factory(Payment)().make({
          senderCard: hire.card,
          receiverCard: hire.drawer.station.card,
          sum: hire.drawer.station.price,
          description: '',
        });
        payments.push(payment);
        hire.card.balance -= hire.drawer.station.price;
        hire.drawer.station.card.balance += hire.drawer.station.price;
        return hire;
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
    let hireId = 0;
    const orders = await factory(Order)()
      .map(async (order) => {
        order.hire = hires[hireId++];
        order.hire.card.balance -= order.price;
        if (order.status !== Status.CREATED) {
          order.executorCard = faker.helpers.arrayElement(cards);
        }
        if (order.status === Status.COMPLETED) {
          const payment = await factory(Payment)().make({
            senderCard: order.hire.card,
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
        delivery.fromHire = hires[hireId++];
        delivery.toHire = hires[hireId++];
        delivery.fromHire.card.balance -= delivery.price;
        if (delivery.status !== Status.CREATED) {
          delivery.executorCard = faker.helpers.arrayElement(cards);
        }
        if (delivery.status === Status.COMPLETED) {
          const payment = await factory(Payment)().make({
            senderCard: delivery.fromHire.card,
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
    let tradeId = 0;
    const marketsDeliveries = await factory(MarketDelivery)()
      .map(async (marketDelivery) => {
        marketDelivery.trade = trades[tradeId++];
        marketDelivery.hire = hires[hireId++];
        marketDelivery.hire.card.balance -= marketDelivery.price;
        if (marketDelivery.status !== Status.CREATED) {
          marketDelivery.executorCard = faker.helpers.arrayElement(cards);
        }
        if (marketDelivery.status === Status.COMPLETED) {
          const payment = await factory(Payment)().make({
            senderCard: marketDelivery.hire.card,
            receiverCard: marketDelivery.executorCard,
            sum: marketDelivery.price,
            description: '',
          });
          payments.push(payment);
          marketDelivery.executorCard.balance += marketDelivery.price;
        }
        return marketDelivery;
      })
      .makeMany(10);
    let saleId = 0;
    const storagesDeliveries = await factory(StorageDelivery)()
      .map(async (storageDelivery) => {
        storageDelivery.sale = sales[saleId++];
        storageDelivery.hire = hires[hireId++];
        storageDelivery.hire.card.balance -= storageDelivery.price;
        if (storageDelivery.status !== Status.CREATED) {
          storageDelivery.executorCard = faker.helpers.arrayElement(cards);
        }
        if (storageDelivery.status === Status.COMPLETED) {
          const payment = await factory(Payment)().make({
            senderCard: storageDelivery.hire.card,
            receiverCard: storageDelivery.executorCard,
            sum: storageDelivery.price,
            description: '',
          });
          payments.push(payment);
          storageDelivery.executorCard.balance += storageDelivery.price;
        }
        return storageDelivery;
      })
      .makeMany(10);
    const tasks = await factory(Task)()
      .map(async (task) => {
        task.customerCard = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= task.price),
        );
        task.customerCard.balance -= task.price;
        if (task.status !== Status.CREATED) {
          task.executorCard = faker.helpers.arrayElement(cards);
        }
        if (task.status === Status.COMPLETED) {
          const payment = await factory(Payment)().make({
            senderCard: task.customerCard,
            receiverCard: task.executorCard,
            sum: task.price,
            description: '',
          });
          payments.push(payment);
          task.executorCard.balance += task.price;
        }
        return task;
      })
      .makeMany(10);
    const adverts = await factory(Advert)()
      .map(async (advert) => {
        advert.card = faker.helpers.arrayElement(cards);
        return advert;
      })
      .makeMany(10);
    const polls = await factory(Poll)()
      .map(async (poll) => {
        poll.user = faker.helpers.arrayElement(users);
        return poll;
      })
      .createMany(10);
    const pollsUsers = polls.reduce(
      (prev, poll) => [...prev, ...users.map((user) => ({ poll, user }))],
      [],
    );
    const randomPollViews = [...Array(pollsUsers.length).keys()];
    randomPollViews.sort(() => Math.random() - 0.5);
    let pollViewId = 0;
    await factory(PollView)()
      .map(async (view) => {
        view.poll = pollsUsers[randomPollViews[pollViewId]].poll;
        view.user = pollsUsers[randomPollViews[pollViewId]].user;
        pollViewId++;
        return view;
      })
      .createMany(80);
    const randomVotes = [...Array(pollsUsers.length).keys()];
    randomVotes.sort(() => Math.random() - 0.5);
    let voteId = 0;
    const votes = await factory(Vote)()
      .map(async (vote) => {
        vote.poll = pollsUsers[randomVotes[voteId]].poll;
        vote.user = pollsUsers[randomVotes[voteId]].user;
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
    await factory(Storage)()
      .map(async () => storages[id++])
      .createMany(storages.length);
    id = 0;
    await factory(Station)()
      .map(async () => stations[id++])
      .createMany(stations.length);
    id = 0;
    await factory(MarketTag)()
      .map(async () => marketsTags[id++])
      .createMany(marketsTags.length);
    id = 0;
    await factory(StorageTag)()
      .map(async () => storagesTags[id++])
      .createMany(storagesTags.length);
    id = 0;
    await factory(MarketTagState)()
      .map(async () => marketsTagsStates[id++])
      .createMany(marketsTagsStates.length);
    id = 0;
    await factory(StorageTagState)()
      .map(async () => storagesTagsStates[id++])
      .createMany(storagesTagsStates.length);
    id = 0;
    await factory(StationState)()
      .map(async () => stationsStates[id++])
      .createMany(stationsStates.length);
    id = 0;
    await factory(Store)()
      .map(async () => stores[id++])
      .createMany(stores.length);
    id = 0;
    await factory(Cell)()
      .map(async () => cells[id++])
      .createMany(cells.length);
    id = 0;
    await factory(Drawer)()
      .map(async () => drawers[id++])
      .createMany(drawers.length);
    id = 0;
    await factory(Rent)()
      .map(async () => rents[id++])
      .createMany(rents.length);
    id = 0;
    await factory(Lease)()
      .map(async () => leases[id++])
      .createMany(leases.length);
    id = 0;
    await factory(Hire)()
      .map(async () => hires[id++])
      .createMany(hires.length);
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
    await factory(MarketDelivery)()
      .map(async () => marketsDeliveries[id++])
      .createMany(marketsDeliveries.length);
    id = 0;
    await factory(StorageDelivery)()
      .map(async () => storagesDeliveries[id++])
      .createMany(storagesDeliveries.length);
    id = 0;
    await factory(Task)()
      .map(async () => tasks[id++])
      .createMany(tasks.length);
    id = 0;
    await factory(Advert)()
      .map(async () => adverts[id++])
      .createMany(adverts.length);
  }
}
