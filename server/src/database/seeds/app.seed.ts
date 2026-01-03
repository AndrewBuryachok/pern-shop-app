import { faker } from '@faker-js/faker';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { Message } from '../../features/messages/message.entity';
import { Article } from '../../features/articles/article.entity';
import { View } from '../../features/articles/view.entity';
import { Like } from '../../features/articles/like.entity';
import { Comment } from '../../features/articles/comment.entity';
import { Account } from '../../features/cards/account.entity';
import { Card } from '../../features/cards/card.entity';
import { Exchange } from '../../features/exchanges/exchange.entity';
import { Payment } from '../../features/payments/payment.entity';
import { Invoice } from '../../features/invoices/invoice.entity';
import { Town } from '../../features/towns/town.entity';
import { Shop } from '../../features/shops/shop.entity';
import { Station } from '../../features/stations/station.entity';
import { Good } from '../../features/goods/good.entity';
import { GoodState } from '../../features/goods/good-state.entity';
import { Purchase } from '../../features/purchases/purchase.entity';
import { Delivery } from '../../features/deliveries/delivery.entity';
import { Order } from '../../features/orders/order.entity';
import { Status } from '../../features/transportations/status.enum';
import { hashData } from '../../common/utils';

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
    const randomViews = [...Array(articlesUsers.length).keys()];
    randomViews.sort(() => Math.random() - 0.5);
    let viewId = 0;
    const views = await factory(View)()
      .map(async (view) => {
        view.article = articlesUsers[randomViews[viewId]].article;
        view.user = articlesUsers[randomViews[viewId]].user;
        viewId++;
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
    const accounts = await factory(Account)()
      .map(async (account) => {
        account.user = faker.helpers.arrayElement(users);
        return account;
      })
      .makeMany(40);
    let cardId = 0;
    const cards = await factory(Card)()
      .map(async (card) => {
        card.account = accounts[Math.floor(cardId / 2)];
        card.user =
          cardId % 2 === 0
            ? card.account.user
            : faker.helpers.arrayElement(users);
        cardId++;
        return card;
      })
      .makeMany(80);
    const exchanges = await factory(Exchange)()
      .map(async (exchange) => {
        exchange.executorUser = faker.helpers.arrayElement(users);
        exchange.customerCard = faker.helpers.arrayElement(
          cards.filter(
            (card) => exchange.type || card.account.balance >= exchange.sum,
          ),
        );
        if (exchange.type) {
          exchange.customerCard.account.balance += exchange.sum;
        } else {
          exchange.customerCard.account.balance -= exchange.sum;
        }
        return exchange;
      })
      .makeMany(40);
    const payments = await factory(Payment)()
      .map(async (payment) => {
        payment.senderCard = faker.helpers.arrayElement(
          cards.filter((card) => card.account.balance >= payment.sum),
        );
        payment.receiverCard = faker.helpers.arrayElement(cards);
        payment.senderCard.account.balance -= payment.sum;
        payment.receiverCard.account.balance += payment.sum;
        return payment;
      })
      .makeMany(40);
    let id = 1;
    const invoices = await factory(Invoice)()
      .map(async (invoice) => {
        invoice.senderCard = faker.helpers.arrayElement(cards);
        invoice.receiverUser = faker.helpers.arrayElement(users);
        if (invoice.completedAt) {
          invoice.receiverCard = faker.helpers.arrayElement(
            cards.filter((card) => card.account.balance >= invoice.sum),
          );
          invoice.receiverUser = invoice.receiverCard.user;
          const payment = await factory(Payment)().make({
            senderCard: invoice.receiverCard,
            receiverCard: invoice.senderCard,
            sum: invoice.sum,
            description: `оплата штрафу ${id++}`,
          });
          payments.push(payment);
          invoice.receiverCard.account.balance -= invoice.sum;
          invoice.senderCard.account.balance += invoice.sum;
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
    const shops = await factory(Shop)()
      .map(async (shop) => {
        shop.card = faker.helpers.arrayElement(cards);
        return shop;
      })
      .makeMany(10);
    const stations = await factory(Station)()
      .map(async (station) => {
        station.user = faker.helpers.arrayElement(users);
        return station;
      })
      .makeMany(10);
    const goods = await factory(Good)()
      .map(async (good) => {
        good.shop = faker.helpers.arrayElement(shops);
        good.card = good.shop.card;
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
    id = 1;
    const purchases = await factory(Purchase)()
      .map(async (purchase) => {
        purchase.good = faker.helpers.arrayElement(
          goods.filter((good) => good.amount),
        );
        purchase.card = faker.helpers.arrayElement(
          cards.filter((card) => card.account.balance >= purchase.good.price),
        );
        purchase.amount =
          Math.floor(
            Math.random() *
              Math.min(
                purchase.good.amount,
                Math.floor(purchase.card.account.balance / purchase.good.price),
              ),
          ) + 1;
        purchase.good.amount -= purchase.amount;
        const payment = await factory(Payment)().make({
          senderCard: purchase.card,
          receiverCard: purchase.good.card,
          sum: purchase.amount * purchase.good.price,
          description: `купівля товару ${id++}`,
        });
        payments.push(payment);
        purchase.card.account.balance -= purchase.amount * purchase.good.price;
        purchase.good.card.account.balance +=
          purchase.amount * purchase.good.price;
        return purchase;
      })
      .makeMany(60);
    let purchaseId = 0;
    id = 1;
    const deliveries = await factory(Delivery)()
      .map(async (delivery) => {
        delivery.station = faker.helpers.arrayElement(stations);
        delivery.customerCard = faker.helpers.arrayElement(cards);
        delivery.purchase = purchases[purchaseId++];
        const maxPrice = delivery.customerCard.account.balance / 2;
        delivery.price = Math.floor(Math.random() * maxPrice) + 1;
        delivery.customerCard.account.balance -= delivery.price;
        if (delivery.status !== Status.CREATED) {
          delivery.executorCard = faker.helpers.arrayElement(cards);
        }
        if (delivery.status === Status.COMPLETED) {
          const payment = await factory(Payment)().make({
            senderCard: delivery.customerCard,
            receiverCard: delivery.executorCard,
            sum: delivery.price,
            description: `виконання доставки ${id}`,
          });
          payments.push(payment);
          delivery.executorCard.account.balance += delivery.price;
        }
        id++;
        return delivery;
      })
      .makeMany(30);
    id = 1;
    const orders = await factory(Order)()
      .map(async (order) => {
        order.station = faker.helpers.arrayElement(stations);
        order.customerCard = faker.helpers.arrayElement(cards);
        const maxPrice = order.customerCard.account.balance / 2;
        order.price = Math.floor(Math.random() * maxPrice) + 1;
        order.customerCard.account.balance -= order.price;
        if (order.status !== Status.CREATED) {
          order.executorCard = faker.helpers.arrayElement(cards);
        }
        if (order.status === Status.COMPLETED) {
          const payment = await factory(Payment)().make({
            senderCard: order.customerCard,
            receiverCard: order.executorCard,
            sum: order.price,
            description: `виконання замовлення ${id}`,
          });
          payments.push(payment);
          order.executorCard.account.balance += order.price;
        }
        id++;
        return order;
      })
      .makeMany(10);
    id = 0;
    await factory(Account)()
      .map(async () => accounts[id++])
      .createMany(accounts.length);
    id = 0;
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
    await factory(Station)()
      .map(async () => stations[id++])
      .createMany(stations.length);
    id = 0;
    await factory(Good)()
      .map(async () => goods[id++])
      .createMany(goods.length);
    id = 0;
    await factory(GoodState)()
      .map(async () => goodsStates[id++])
      .createMany(goodsStates.length);
    id = 0;
    await factory(Purchase)()
      .map(async () => purchases[id++])
      .createMany(purchases.length);
    id = 0;
    await factory(Delivery)()
      .map(async () => deliveries[id++])
      .createMany(deliveries.length);
    id = 0;
    await factory(Order)()
      .map(async () => orders[id++])
      .createMany(orders.length);
  }
}
