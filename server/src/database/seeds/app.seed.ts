import { faker } from '@faker-js/faker';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { Message } from '../../features/messages/message.entity';
import { Report } from '../../features/reports/report.entity';
import { ReportView } from '../../features/reports/report-view.entity';
import { ReportLike } from '../../features/reports/report-like.entity';
import { ReportComment } from '../../features/reports/comment.entity';
import { Article } from '../../features/articles/article.entity';
import { ArticleView } from '../../features/articles/article-view.entity';
import { ArticleLike } from '../../features/articles/article-like.entity';
import { ArticleComment } from '../../features/articles/comment.entity';
import { Poll } from '../../features/polls/poll.entity';
import { PollView } from '../../features/polls/poll-view.entity';
import { PollLike } from '../../features/polls/poll-like.entity';
import { PollComment } from '../../features/polls/comment.entity';
import { Card } from '../../features/cards/card.entity';
import { Exchange } from '../../features/exchanges/exchange.entity';
import { Payment } from '../../features/payments/payment.entity';
import { Invoice } from '../../features/invoices/invoice.entity';
import { Town } from '../../features/towns/town.entity';
import { Farm } from '../../features/farms/farm.entity';
import { Shop } from '../../features/shops/shop.entity';
import { Market } from '../../features/markets/market.entity';
import { Storage } from '../../features/storages/storage.entity';
import { Station } from '../../features/stations/station.entity';
import { MarketTag } from '../../features/markets-tags/market-tag.entity';
import { StorageTag } from '../../features/storages-tags/storage-tag.entity';
import { MarketTagState } from '../../features/markets-tags/market-tag-state.entity';
import { StorageTagState } from '../../features/storages-tags/storage-tag-state.entity';
import { StationState } from '../../features/stations/station-state.entity';
import { Stall } from '../../features/stalls/stall.entity';
import { Cell } from '../../features/cells/cell.entity';
import { Box } from '../../features/boxes/box.entity';
import { Rent } from '../../features/rents/rent.entity';
import { Lease } from '../../features/leases/lease.entity';
import { Hire } from '../../features/hires/hire.entity';
import { Thing } from '../../features/things/thing.entity';
import { Good } from '../../features/goods/good.entity';
import { GoodState } from '../../features/goods/good-state.entity';
import { Ware } from '../../features/wares/ware.entity';
import { WareState } from '../../features/wares/ware-state.entity';
import { Product } from '../../features/products/product.entity';
import { ProductState } from '../../features/products/product-state.entity';
import { Purchase } from '../../features/purchases/purchase.entity';
import { Order } from '../../features/orders/order.entity';
import { Haulage } from '../../features/haulages/haulage.entity';
import { Delivery } from '../../features/deliveries/delivery.entity';
import { Task } from '../../features/tasks/task.entity';
import { Advert } from '../../features/adverts/advert.entity';
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
    const randomReportsLikes = [...Array(reportsUsers.length).keys()];
    randomReportsLikes.sort(() => Math.random() - 0.5);
    let reportLikeId = 0;
    const reportsLikes = await factory(ReportLike)()
      .map(async (like) => {
        like.report = reportsUsers[randomReportsLikes[reportLikeId]].report;
        like.user = reportsUsers[randomReportsLikes[reportLikeId]].user;
        reportLikeId++;
        return like;
      })
      .createMany(80);
    const reportsComments = await factory(ReportComment)()
      .map(async (comment) => {
        comment.report = faker.helpers.arrayElement(reports);
        comment.user = faker.helpers.arrayElement(users);
        return comment;
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
    const randomArticlesLikes = [...Array(articlesUsers.length).keys()];
    randomArticlesLikes.sort(() => Math.random() - 0.5);
    let articleLikeId = 0;
    const articlesLikes = await factory(ArticleLike)()
      .map(async (like) => {
        like.article =
          articlesUsers[randomArticlesLikes[articleLikeId]].article;
        like.user = articlesUsers[randomArticlesLikes[articleLikeId]].user;
        articleLikeId++;
        return like;
      })
      .createMany(80);
    const articlesComments = await factory(ArticleComment)()
      .map(async (comment) => {
        comment.article = faker.helpers.arrayElement(articles);
        comment.user = faker.helpers.arrayElement(users);
        return comment;
      })
      .createMany(40);
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
    const randomPollsLikes = [...Array(pollsUsers.length).keys()];
    randomPollsLikes.sort(() => Math.random() - 0.5);
    let pollLikeId = 0;
    const pollsLikes = await factory(PollLike)()
      .map(async (like) => {
        like.poll = pollsUsers[randomPollsLikes[pollLikeId]].poll;
        like.user = pollsUsers[randomPollsLikes[pollLikeId]].user;
        pollLikeId++;
        return like;
      })
      .createMany(80);
    const pollsComments = await factory(PollComment)()
      .map(async (comment) => {
        comment.poll = faker.helpers.arrayElement(polls);
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
    let towners = users.sort(() => 0.5 - Math.random());
    const towns = await factory(Town)()
      .map(async (town) => {
        const count = Math.floor(Math.random() * 2) + 1;
        town.users = towners.slice(0, count);
        town.user = town.users[0];
        towners = towners.slice(count);
        return town;
      })
      .createMany(10);
    const farms = await factory(Farm)()
      .map(async (farm) => {
        const count = Math.floor(Math.random() * 2) + 1;
        const shuffled = users.sort(() => 0.5 - Math.random());
        farm.users = shuffled.slice(0, count);
        farm.user = farm.users[0];
        return farm;
      })
      .createMany(10);
    const shops = await factory(Shop)()
      .map(async (shop) => {
        shop.card = faker.helpers.arrayElement(cards);
        return shop;
      })
      .makeMany(10);
    const markets = await factory(Market)()
      .map(async (market) => {
        market.card = faker.helpers.arrayElement(cards);
        market.stalls = [];
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
        station.boxes = [];
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
    const stalls = await factory(Stall)()
      .map(async (stall) => {
        stall.marketTag = faker.helpers.arrayElement(marketsTags);
        stall.market = stall.marketTag.market;
        stall.market.stalls.push(stall);
        stall.name = stall.market.stalls.length;
        return stall;
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
    const boxes = await factory(Box)()
      .map(async (box) => {
        box.station = faker.helpers.arrayElement(stations);
        box.station.boxes.push(box);
        box.name = box.station.boxes.length;
        return box;
      })
      .makeMany(60);
    const rents = await factory(Rent)()
      .map(async (rent) => {
        rent.stall = faker.helpers.arrayElement(
          stalls.filter((stall) => !stall.reservedUntil),
        );
        rent.stall.reservedUntil = getDateWeekAfter();
        rent.card = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= rent.stall.marketTag.price),
        );
        rent.sum = rent.stall.marketTag.price;
        const payment = await factory(Payment)().make({
          senderCard: rent.card,
          receiverCard: rent.stall.market.card,
          sum: rent.stall.marketTag.price,
          description: '',
        });
        payments.push(payment);
        rent.card.balance -= rent.stall.marketTag.price;
        rent.stall.market.card.balance += rent.stall.marketTag.price;
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
        hire.box = faker.helpers.arrayElement(
          boxes.filter((box) => !box.reservedUntil),
        );
        hire.box.reservedUntil = getDateWeekAfter();
        hire.card = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= hire.box.station.price),
        );
        hire.sum = hire.box.station.price;
        const payment = await factory(Payment)().make({
          senderCard: hire.card,
          receiverCard: hire.box.station.card,
          sum: hire.box.station.price,
          description: '',
        });
        payments.push(payment);
        hire.card.balance -= hire.box.station.price;
        hire.box.station.card.balance += hire.box.station.price;
        return hire;
      })
      .makeMany(60);
    const goods = await factory(Good)()
      .map(async (good) => {
        good.shop = faker.helpers.arrayElement(shops);
        return good;
      })
      .makeMany(20);
    let goodId = 0;
    const goodsStates = await factory(GoodState)()
      .map(async (goodState) => {
        goodState.good = goods[goodId++];
        goodState.price = goodState.good.price;
        return goodState;
      })
      .makeMany(goods.length);
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
    const products = await factory(Product)()
      .map(async (product) => {
        product.lease = faker.helpers.arrayElement(leases);
        return product;
      })
      .makeMany(20);
    let productId = 0;
    const productsStates = await factory(ProductState)()
      .map(async (productState) => {
        productState.product = products[productId++];
        productState.price = productState.product.price;
        return productState;
      })
      .makeMany(products.length);
    const purchases = await factory(Purchase)()
      .map(async (purchase) => {
        let thing: Thing, card: Card;
        switch (Math.floor(Math.random() * 3)) {
          case 0:
            purchase.good = faker.helpers.arrayElement(
              goods.filter((good) => good.amount),
            );
            thing = purchase.good;
            card = purchase.good.shop.card;
            break;
          case 1:
            purchase.ware = faker.helpers.arrayElement(
              wares.filter((ware) => ware.amount),
            );
            thing = purchase.ware;
            card = purchase.ware.rent.card;
            break;
          case 2:
            purchase.product = faker.helpers.arrayElement(
              products.filter((product) => product.amount),
            );
            thing = purchase.product;
            card = purchase.product.lease.card;
            break;
        }
        purchase.card = faker.helpers.arrayElement(
          cards.filter((card) => card.balance >= thing.price),
        );
        purchase.amount =
          Math.floor(
            Math.random() *
              Math.min(
                thing.amount,
                Math.floor(purchase.card.balance / thing.price),
              ),
          ) + 1;
        thing.amount -= purchase.amount;
        const payment = await factory(Payment)().make({
          senderCard: purchase.card,
          receiverCard: card,
          sum: purchase.amount * thing.price,
          description: '',
        });
        payments.push(payment);
        purchase.card.balance -= purchase.amount * thing.price;
        card.balance += purchase.amount * thing.price;
        return purchase;
      })
      .makeMany(60);
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
    const haulages = await factory(Haulage)()
      .map(async (haulage) => {
        haulage.fromHire = hires[hireId++];
        haulage.toHire = hires[hireId++];
        haulage.fromHire.card.balance -= haulage.price;
        if (haulage.status !== Status.CREATED) {
          haulage.executorCard = faker.helpers.arrayElement(cards);
        }
        if (haulage.status === Status.COMPLETED) {
          const payment = await factory(Payment)().make({
            senderCard: haulage.fromHire.card,
            receiverCard: haulage.executorCard,
            sum: haulage.price,
            description: '',
          });
          payments.push(payment);
          haulage.executorCard.balance += haulage.price;
        }
        return haulage;
      })
      .makeMany(10);
    let purchaseId = 0;
    const deliveries = await factory(Delivery)()
      .map(async (delivery) => {
        delivery.purchase = purchases[purchaseId++];
        delivery.hire = hires[hireId++];
        delivery.hire.card.balance -= delivery.price;
        if (delivery.status !== Status.CREATED) {
          delivery.executorCard = faker.helpers.arrayElement(cards);
        }
        if (delivery.status === Status.COMPLETED) {
          const payment = await factory(Payment)().make({
            senderCard: delivery.hire.card,
            receiverCard: delivery.executorCard,
            sum: delivery.price,
            description: '',
          });
          payments.push(payment);
          delivery.executorCard.balance += delivery.price;
        }
        return delivery;
      })
      .makeMany(30);
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
    await factory(Shop)()
      .map(async () => shops[id++])
      .createMany(shops.length);
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
    await factory(Stall)()
      .map(async () => stalls[id++])
      .createMany(stalls.length);
    id = 0;
    await factory(Cell)()
      .map(async () => cells[id++])
      .createMany(cells.length);
    id = 0;
    await factory(Box)()
      .map(async () => boxes[id++])
      .createMany(boxes.length);
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
    await factory(Good)()
      .map(async () => goods[id++])
      .createMany(goods.length);
    id = 0;
    await factory(GoodState)()
      .map(async () => goodsStates[id++])
      .createMany(goodsStates.length);
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
    await factory(Haulage)()
      .map(async () => haulages[id++])
      .createMany(haulages.length);
    id = 0;
    await factory(Purchase)()
      .map(async () => purchases[id++])
      .createMany(purchases.length);
    id = 0;
    await factory(Delivery)()
      .map(async () => deliveries[id++])
      .createMany(deliveries.length);
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
