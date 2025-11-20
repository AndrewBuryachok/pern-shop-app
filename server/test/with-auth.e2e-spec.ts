import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { appConfig } from '../src/config/app.config';
import { Tokens } from '../src/features/auth/auth.interface';
import { Role } from '../src/features/users/role.enum';
import { Item } from '../src/features/things/item.enum';

jest.mock('mqtt', () => ({
  connect: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn(),
  })),
}));

describe('With Auth', () => {
  let app: INestApplication;
  let user: Tokens;
  let admin: Tokens;
  let moder: Tokens;
  let banker: Tokens;
  let merchant: Tokens;
  let spawn: Tokens;
  let hub: Tokens;
  let end: Tokens;
  let messageId: number;
  let articlesId: number[];
  let articleCommentId: number;
  let cardId: number;
  let exchangesId: number;
  let paymentsId: number;
  let invoicesId: number;
  let townId: number;
  let shopId: number;
  let marketId: number;
  let storageId: number;
  let stationId: number;
  let marketTagId: number;
  let storageTagId: number;
  let stallId: number;
  let cellId: number;
  let boxId: number;
  let rentId: number;
  let leaseId: number;
  let hireId: number;
  let shopGoodsId: number[];
  let marketGoodsId: number[];
  let storageGoodsId: number[];
  let shopsPurchasesId: number[];
  let marketsPurchasesId: number[];
  let storagesPurchasesId: number[];
  let shopsDeliveriesId: number[];
  let marketsDeliveriesId: number[];
  let storagesDeliveriesId: number[];
  let ordersId: number[];
  let haulagesId: number[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appConfig(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('POST /auth/login as User', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'User', password: 'User' })
        .expect(201)
        .then((res) => (user = res.body));
    });

    it('POST /auth/logout as User', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(201);
    });

    it('PATCH /auth/password', async () => {
      return request(app.getHttpServer())
        .patch('/auth/password')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ oldPassword: 'User', newPassword: 'User' })
        .expect('');
    });

    it('POST /auth/login as Admin', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Admin', password: 'Admin' })
        .expect(201)
        .then((res) => (admin = res.body));
    });

    it('POST /auth/logout as Admin', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect(201);
    });

    it('POST /auth/login as Moder', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Moder', password: 'Moder' })
        .expect(201)
        .then((res) => (moder = res.body));
    });

    it('POST /auth/logout as Moder', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${moder.access}`)
        .expect(201);
    });

    it('POST /auth/login as Banker', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Banker', password: 'Banker' })
        .expect(201)
        .then((res) => (banker = res.body));
    });

    it('POST /auth/logout as Banker', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${banker.access}`)
        .expect(201);
    });

    it('POST /auth/login as Merchant', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Merchant', password: 'Merchant' })
        .expect(201)
        .then((res) => (merchant = res.body));
    });

    it('POST /auth/logout as Merchant', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect(201);
    });

    it('POST /auth/login as SpawnHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'SpawnHead', password: 'SpawnHead' })
        .expect(201)
        .then((res) => (spawn = res.body));
    });

    it('POST /auth/logout as SpawnHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${spawn.access}`)
        .expect(201);
    });

    it('POST /auth/login as HubHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'HubHead', password: 'HubHead' })
        .expect(201)
        .then((res) => (hub = res.body));
    });

    it('POST /auth/logout as HubHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${hub.access}`)
        .expect(201);
    });

    it('POST /auth/login as EndHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'EndHead', password: 'EndHead' })
        .expect(201)
        .then((res) => (end = res.body));
    });

    it('POST /auth/logout as EndHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${end.access}`)
        .expect(201);
    });
  });

  describe('Users', () => {
    it('POST /towns', async () => {
      return request(app.getHttpServer())
        .post('/towns')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Town',
          description: '',
          x: 500,
          y: 500,
        })
        .expect('');
    });

    it('GET /users', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /users/my', async () => {
      return request(app.getHttpServer())
        .get('/users/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /users/all', async () => {
      return request(app.getHttpServer())
        .get('/users/all')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /users/all/select', async () => {
      return request(app.getHttpServer())
        .get('/users/all/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /users/not-citizens/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-citizens/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /users/not-friends/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-friends/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /users/:userId/profile', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${user.id}/profile`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          nick: user.nick,
          avatar: '',
          background: 1,
          discord: '',
          twitch: '',
          youtube: '',
        })
        .expect('');
    });

    it('PATCH /users/:userId/password', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${user.id}/password`)
        .set('Authorization', `Bearer ${admin.access}`)
        .send({ password: 'User' })
        .expect('');
    });

    it('POST /users/:userId/roles', async () => {
      return request(app.getHttpServer())
        .post(`/users/${user.id}/roles`)
        .set('Authorization', `Bearer ${admin.access}`)
        .send({ role: Role.ADMIN })
        .expect('');
    });

    it('DELETE /users/:userId/roles', async () => {
      return request(app.getHttpServer())
        .delete(`/users/${user.id}/roles`)
        .set('Authorization', `Bearer ${admin.access}`)
        .send({ role: Role.ADMIN })
        .expect('');
    });
  });

  describe('Messages', () => {
    it('POST /messages', async () => {
      return request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          userId: user.id,
          messageId: 0,
          text: 'message text',
        })
        .expect('');
    });

    it('GET /messages/:userId', async () => {
      return request(app.getHttpServer())
        .get(`/messages/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0))
        .then((res) => (messageId = res.body[0].id));
    });

    it('PATCH /messages/:messageId', async () => {
      return request(app.getHttpServer())
        .patch(`/messages/${messageId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'message text' })
        .expect('');
    });

    it('DELETE /messages/:messageId', async () => {
      return request(app.getHttpServer())
        .delete(`/messages/${messageId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Friends', () => {
    it('POST /friends/:friendId', async () => {
      return request(app.getHttpServer())
        .post(`/friends/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /friends/sent', async () => {
      return request(app.getHttpServer())
        .get('/friends/sent')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /friends/received', async () => {
      return request(app.getHttpServer())
        .get('/friends/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /friends/:friendId', async () => {
      return request(app.getHttpServer())
        .post(`/friends/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /friends/my', async () => {
      return request(app.getHttpServer())
        .get('/friends/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /friends/:friendId', async () => {
      return request(app.getHttpServer())
        .delete(`/friends/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Articles', () => {
    it('POST /articles', async () => {
      return request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'article text', images: [] })
        .expect('');
    });

    it('POST /articles', async () => {
      return request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'article text', images: [] })
        .expect('');
    });

    it('GET /articles', async () => {
      return request(app.getHttpServer())
        .get('/articles')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /articles/my', async () => {
      return request(app.getHttpServer())
        .get('/articles/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (articlesId = res.body.result.map((p) => p.id)));
    });

    it('POST /articles/:articleId/views', async () => {
      return request(app.getHttpServer())
        .post(`/articles/${articlesId[0]}/views`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /articles/:articleId/likes', async () => {
      return request(app.getHttpServer())
        .post(`/articles/${articlesId[0]}/likes`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ type: true })
        .expect('');
    });

    it('POST /articles/:articleId/likes', async () => {
      return request(app.getHttpServer())
        .post(`/articles/${articlesId[1]}/likes`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ type: false })
        .expect('');
    });

    it('POST /articles-comments', async () => {
      return request(app.getHttpServer())
        .post('/articles-comments')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ articleId: articlesId[0], commentId: 0, text: 'comment text' })
        .expect('');
    });

    it('GET /articles/liked', async () => {
      return request(app.getHttpServer())
        .get('/articles/liked')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /articles/commented', async () => {
      return request(app.getHttpServer())
        .get('/articles/commented')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /articles/viewed/select', async () => {
      return request(app.getHttpServer())
        .get('/articles/viewed/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /articles/liked/select', async () => {
      return request(app.getHttpServer())
        .get('/articles/liked/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) =>
          expect(res.body.up.length + res.body.down.length).toBeGreaterThan(0),
        );
    });

    it('GET /articles/:articleId/views', async () => {
      return request(app.getHttpServer())
        .get(`/articles/${articlesId[0]}/views`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /articles/:articleId/likes', async () => {
      return request(app.getHttpServer())
        .get(`/articles/${articlesId[0]}/likes`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /articles-comments/:articleId', async () => {
      return request(app.getHttpServer())
        .get(`/articles-comments/${articlesId[0]}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0))
        .then((res) => (articleCommentId = res.body[0].id));
    });

    it('GET /articles/all', async () => {
      return request(app.getHttpServer())
        .get('/articles/all')
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('PATCH /articles/:articleId', async () => {
      return request(app.getHttpServer())
        .patch(`/articles/${articlesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'article text', images: [] })
        .expect('');
    });

    it('DELETE /articles/:articleId', async () => {
      return request(app.getHttpServer())
        .delete(`/articles/${articlesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Articles Comments', () => {
    it('PATCH /articles-comments/:commentId', async () => {
      return request(app.getHttpServer())
        .patch(`/articles-comments/${articleCommentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'comment text' })
        .expect('');
    });

    it('DELETE /articles-comments/:commentId', async () => {
      return request(app.getHttpServer())
        .delete(`/articles-comments/${articleCommentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Cards', () => {
    it('POST /cards', async () => {
      return request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ name: 'My Card', color: 1 })
        .expect('');
    });

    it('GET /cards/my', async () => {
      return request(app.getHttpServer())
        .get('/cards/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (cardId = res.body.result[0].id));
    });

    it('GET /cards/all', async () => {
      return request(app.getHttpServer())
        .get('/cards/all')
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /cards/my/select', async () => {
      return request(app.getHttpServer())
        .get('/cards/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cards/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/cards/${user.id}/select`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cards/:userId/ext-select', async () => {
      return request(app.getHttpServer())
        .get(`/cards/${user.id}/ext-select`)
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cards/:cardId/users', async () => {
      return request(app.getHttpServer())
        .get(`/cards/${cardId}/users`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /cards/:cardId', async () => {
      return request(app.getHttpServer())
        .patch(`/cards/${cardId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ name: 'My Card', color: 1 })
        .expect('');
    });

    it('POST /cards/:cardId/users', async () => {
      return request(app.getHttpServer())
        .post(`/cards/${cardId}/users`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: admin.id })
        .expect('');
    });

    it('DELETE /cards/:cardId/users', async () => {
      return request(app.getHttpServer())
        .delete(`/cards/${cardId}/users`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: admin.id })
        .expect('');
    });
  });

  describe('Exchanges', () => {
    it('POST /exchanges', async () => {
      return request(app.getHttpServer())
        .post('/exchanges')
        .set('Authorization', `Bearer ${banker.access}`)
        .send({ cardId, type: true, sum: 100 })
        .expect('');
    });

    it('POST /exchanges', async () => {
      return request(app.getHttpServer())
        .post('/exchanges')
        .set('Authorization', `Bearer ${banker.access}`)
        .send({ cardId, type: true, sum: 100 })
        .expect('');
    });

    it('GET /exchanges/my', async () => {
      return request(app.getHttpServer())
        .get('/exchanges/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /exchanges/all', async () => {
      return request(app.getHttpServer())
        .get('/exchanges/all')
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (exchangesId = res.body.result.map((e) => e.id)));
    });

    it('DELETE /exchanges/:exchangeId', async () => {
      return request(app.getHttpServer())
        .delete(`/exchanges/${exchangesId[0]}`)
        .set('Authorization', `Bearer ${banker.access}`)
        .expect('');
    });
  });

  describe('Payments', () => {
    it('POST /payments', async () => {
      return request(app.getHttpServer())
        .post('/payments')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          senderCardId: cardId,
          receiverCardId: cardId,
          sum: 10,
          description: '',
        })
        .expect('');
    });

    it('POST /payments', async () => {
      return request(app.getHttpServer())
        .post('/payments')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          senderCardId: cardId,
          receiverCardId: cardId,
          sum: 10,
          description: '',
        })
        .expect('');
    });

    it('GET /payments/my', async () => {
      return request(app.getHttpServer())
        .get('/payments/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /payments/all', async () => {
      return request(app.getHttpServer())
        .get('/payments/all')
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (paymentsId = res.body.result.map((p) => p.id)));
    });

    it('DELETE /payments/:paymentId', async () => {
      return request(app.getHttpServer())
        .delete(`/payments/${paymentsId[0]}`)
        .set('Authorization', `Bearer ${banker.access}`)
        .expect('');
    });
  });

  describe('Invoices', () => {
    it('POST /invoices', async () => {
      return request(app.getHttpServer())
        .post('/invoices')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          senderCardId: cardId,
          receiverUserId: user.id,
          sum: 10,
          description: '',
        })
        .expect('');
    });

    it('POST /invoices', async () => {
      return request(app.getHttpServer())
        .post('/invoices')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          senderCardId: cardId,
          receiverUserId: user.id,
          sum: 10,
          description: '',
        })
        .expect('');
    });

    it('GET /invoices/my', async () => {
      return request(app.getHttpServer())
        .get('/invoices/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (invoicesId = res.body.result.map((i) => i.id)));
    });

    it('GET /invoices/received', async () => {
      return request(app.getHttpServer())
        .get('/invoices/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /invoices/all', async () => {
      return request(app.getHttpServer())
        .get('/invoices/all')
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /invoices/:invoiceId', async () => {
      return request(app.getHttpServer())
        .delete(`/invoices/${invoicesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /invoices/:invoiceId', async () => {
      return request(app.getHttpServer())
        .post(`/invoices/${invoicesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });
  });

  describe('Towns', () => {
    it('GET /towns', async () => {
      return request(app.getHttpServer())
        .get('/towns')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /towns/my', async () => {
      return request(app.getHttpServer())
        .get('/towns/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (townId = res.body.result[0].id));
    });

    it('GET /towns/all', async () => {
      return request(app.getHttpServer())
        .get('/towns/all')
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /towns/all/select', async () => {
      return request(app.getHttpServer())
        .get('/towns/all/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /towns/my/select', async () => {
      return request(app.getHttpServer())
        .get('/towns/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /towns/:townId/users', async () => {
      return request(app.getHttpServer())
        .get(`/towns/${townId}/users`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /towns/:townId', async () => {
      return request(app.getHttpServer())
        .patch(`/towns/${townId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Town',
          description: '',
          x: 500,
          y: 500,
        })
        .expect('');
    });
  });

  describe('Invitations', () => {
    it('POST /invitations/sent/:userId', async () => {
      return request(app.getHttpServer())
        .post(`/invitations/sent/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /invitations/sent', async () => {
      return request(app.getHttpServer())
        .get('/invitations/sent')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /invitations/received', async () => {
      return request(app.getHttpServer())
        .get('/invitations/received')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /invitations/sent/:userId', async () => {
      return request(app.getHttpServer())
        .delete(`/invitations/sent/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /invitations/sent/:userId', async () => {
      return request(app.getHttpServer())
        .post(`/invitations/sent/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /invitations/received/:townId', async () => {
      return request(app.getHttpServer())
        .delete(`/invitations/received/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('POST /invitations/sent/:userId', async () => {
      return request(app.getHttpServer())
        .post(`/invitations/sent/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /invitations/received/:townId', async () => {
      return request(app.getHttpServer())
        .post(`/invitations/received/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('DELETE /residents/:userId', async () => {
      return request(app.getHttpServer())
        .delete(`/residents/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Applications', () => {
    it('POST /applications/sent/:townId', async () => {
      return request(app.getHttpServer())
        .post(`/applications/sent/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('GET /applications/sent', async () => {
      return request(app.getHttpServer())
        .get('/applications/sent')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /applications/received', async () => {
      return request(app.getHttpServer())
        .get('/applications/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /applications/sent/:townId', async () => {
      return request(app.getHttpServer())
        .delete(`/applications/sent/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('POST /applications/sent/:townId', async () => {
      return request(app.getHttpServer())
        .post(`/applications/sent/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('DELETE /applications/received/:userId', async () => {
      return request(app.getHttpServer())
        .delete(`/applications/received/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /applications/sent/:townId', async () => {
      return request(app.getHttpServer())
        .post(`/applications/sent/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('POST /applications/received/:userId', async () => {
      return request(app.getHttpServer())
        .post(`/applications/received/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Residents', () => {
    it('GET /residents/my', async () => {
      return request(app.getHttpServer())
        .get('/residents/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /towns/:townId', async () => {
      return request(app.getHttpServer())
        .delete(`/towns/${townId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Shops', () => {
    it('POST /shops', async () => {
      return request(app.getHttpServer())
        .post('/shops')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          name: 'My Shop',
          description: '',
          x: 500,
          y: -500,
        })
        .expect('');
    });

    it('GET /shops', async () => {
      return request(app.getHttpServer())
        .get('/shops')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /shops/my', async () => {
      return request(app.getHttpServer())
        .get('/shops/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (shopId = res.body.result[0].id));
    });

    it('GET /shops/all', async () => {
      return request(app.getHttpServer())
        .get('/shops/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /shops/all/select', async () => {
      return request(app.getHttpServer())
        .get('/shops/all/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /shops/my/select', async () => {
      return request(app.getHttpServer())
        .get('/shops/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /shops/:shopId', async () => {
      return request(app.getHttpServer())
        .patch(`/shops/${shopId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Shop',
          description: '',
          x: 500,
          y: -500,
        })
        .expect('');
    });
  });

  describe('Markets', () => {
    it('POST /markets', async () => {
      return request(app.getHttpServer())
        .post('/markets')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          name: 'My Market',
          description: '',
          x: -500,
          y: 500,
        })
        .expect('');
    });

    it('GET /markets', async () => {
      return request(app.getHttpServer())
        .get('/markets')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets/my', async () => {
      return request(app.getHttpServer())
        .get('/markets/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (marketId = res.body.result[0].id));
    });

    it('GET /markets/all', async () => {
      return request(app.getHttpServer())
        .get('/markets/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets/main/select', async () => {
      return request(app.getHttpServer())
        .get('/markets/main/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /markets/my/select', async () => {
      return request(app.getHttpServer())
        .get('/markets/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /markets/all/select', async () => {
      return request(app.getHttpServer())
        .get('/markets/all/select')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /markets/:marketId', async () => {
      return request(app.getHttpServer())
        .patch(`/markets/${marketId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Market',
          description: '',
          x: -500,
          y: 500,
        })
        .expect('');
    });
  });

  describe('Storages', () => {
    it('POST /storages', async () => {
      return request(app.getHttpServer())
        .post('/storages')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          name: 'My Storage',
          description: '',
          x: -500,
          y: -500,
        })
        .expect('');
    });

    it('GET /storages', async () => {
      return request(app.getHttpServer())
        .get('/storages')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages/my', async () => {
      return request(app.getHttpServer())
        .get('/storages/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (storageId = res.body.result[0].id));
    });

    it('GET /storages/all', async () => {
      return request(app.getHttpServer())
        .get('/storages/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages/main/select', async () => {
      return request(app.getHttpServer())
        .get('/storages/main/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /storages/my/select', async () => {
      return request(app.getHttpServer())
        .get('/storages/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /storages/all/select', async () => {
      return request(app.getHttpServer())
        .get('/storages/all/select')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /storages/:storageId', async () => {
      return request(app.getHttpServer())
        .patch(`/storages/${storageId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Storage',
          description: '',
          x: -500,
          y: -500,
        })
        .expect('');
    });
  });

  describe('Stations', () => {
    it('POST /stations', async () => {
      return request(app.getHttpServer())
        .post('/stations')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          name: 'My Station',
          description: '',
          x: -500,
          y: -500,
          price: 5,
        })
        .expect('');
    });

    it('GET /stations', async () => {
      return request(app.getHttpServer())
        .get('/stations')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stations/my', async () => {
      return request(app.getHttpServer())
        .get('/stations/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (stationId = res.body.result[0].id));
    });

    it('GET /stations/all', async () => {
      return request(app.getHttpServer())
        .get('/stations/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stations/main/select', async () => {
      return request(app.getHttpServer())
        .get('/stations/main/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /stations/my/select', async () => {
      return request(app.getHttpServer())
        .get('/stations/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /stations/all/select', async () => {
      return request(app.getHttpServer())
        .get('/stations/all/select')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /stations/:stationId', async () => {
      return request(app.getHttpServer())
        .patch(`/stations/${stationId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Station',
          description: '',
          x: -500,
          y: -500,
          price: 10,
        })
        .expect('');
    });

    it('GET /stations/:stationId/states', async () => {
      return request(app.getHttpServer())
        .get(`/stations/${stationId}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Markets Tags', () => {
    it('POST /markets-tags', async () => {
      return request(app.getHttpServer())
        .post('/markets-tags')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          marketId,
          name: 'My Tag',
          price: 5,
        })
        .expect('');
    });

    it('GET /markets-tags', async () => {
      return request(app.getHttpServer())
        .get('/markets-tags')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets-tags/my', async () => {
      return request(app.getHttpServer())
        .get('/markets-tags/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (marketTagId = res.body.result[0].id));
    });

    it('GET /markets-tags/all', async () => {
      return request(app.getHttpServer())
        .get('/markets-tags/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets-tags/:marketId/select', async () => {
      return request(app.getHttpServer())
        .get(`/markets-tags/${marketId}/select`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /markets-tags/:marketTagId', async () => {
      return request(app.getHttpServer())
        .patch(`/markets-tags/${marketTagId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Tag',
          price: 10,
        })
        .expect('');
    });

    it('GET /markets-tags/:marketTagId/states', async () => {
      return request(app.getHttpServer())
        .get(`/markets-tags/${marketTagId}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Storages Tags', () => {
    it('POST /storages-tags', async () => {
      return request(app.getHttpServer())
        .post('/storages-tags')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          storageId,
          name: 'My Tag',
          price: 5,
        })
        .expect('');
    });

    it('GET /storages-tags', async () => {
      return request(app.getHttpServer())
        .get('/storages-tags')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages-tags/my', async () => {
      return request(app.getHttpServer())
        .get('/storages-tags/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (storageTagId = res.body.result[0].id));
    });

    it('GET /storages-tags/all', async () => {
      return request(app.getHttpServer())
        .get('/storages-tags/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages-tags/:storageId/select', async () => {
      return request(app.getHttpServer())
        .get(`/storages-tags/${storageId}/select`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /storages-tags/:storageTagId', async () => {
      return request(app.getHttpServer())
        .patch(`/storages-tags/${storageTagId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Tag',
          price: 10,
        })
        .expect('');
    });

    it('GET /storages-tags/:storageTagId/states', async () => {
      return request(app.getHttpServer())
        .get(`/storages-tags/${storageTagId}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Stalls', () => {
    it('POST /stalls', async () => {
      return request(app.getHttpServer())
        .post('/stalls')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ marketTagId })
        .expect('');
    });

    it('GET /stalls', async () => {
      return request(app.getHttpServer())
        .get('/stalls')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stalls/my', async () => {
      return request(app.getHttpServer())
        .get('/stalls/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (stallId = res.body.result[0].id));
    });

    it('GET /stalls/all', async () => {
      return request(app.getHttpServer())
        .get('/stalls/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stalls/:marketId/markets', async () => {
      return request(app.getHttpServer())
        .get(`/stalls/${marketId}/markets`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /stalls/:marketTagId/tags', async () => {
      return request(app.getHttpServer())
        .get(`/stalls/${marketTagId}/tags`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /stalls/:stallId/tag', async () => {
      return request(app.getHttpServer())
        .get(`/stalls/${stallId}/tag`)
        .expect((res) => expect(res.body.id).toBeGreaterThan(0));
    });
  });

  describe('Cells', () => {
    it('POST /cells', async () => {
      return request(app.getHttpServer())
        .post('/cells')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storageTagId })
        .expect('');
    });

    it('GET /cells', async () => {
      return request(app.getHttpServer())
        .get('/cells')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /cells/my', async () => {
      return request(app.getHttpServer())
        .get('/cells/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (cellId = res.body.result[0].id));
    });

    it('GET /cells/all', async () => {
      return request(app.getHttpServer())
        .get('/cells/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /cells/:storageId/storages', async () => {
      return request(app.getHttpServer())
        .get(`/cells/${storageId}/storages`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cells/:storageTagId/tags', async () => {
      return request(app.getHttpServer())
        .get(`/cells/${storageTagId}/tags`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cells/:cellId/tag', async () => {
      return request(app.getHttpServer())
        .get(`/cells/${cellId}/tag`)
        .expect((res) => expect(res.body.id).toBeGreaterThan(0));
    });
  });

  describe('Boxes', () => {
    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('GET /boxes', async () => {
      return request(app.getHttpServer())
        .get('/boxes')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /boxes/my', async () => {
      return request(app.getHttpServer())
        .get('/boxes/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (boxId = res.body.result[0].id));
    });

    it('GET /boxes/all', async () => {
      return request(app.getHttpServer())
        .get('/boxes/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /boxes/:stationId/select', async () => {
      return request(app.getHttpServer())
        .get(`/boxes/${stationId}/select`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /boxes/:boxId/station', async () => {
      return request(app.getHttpServer())
        .get(`/boxes/${boxId}/station`)
        .expect((res) => expect(res.body.id).toBeGreaterThan(0));
    });

    it('GET /stations/free/select', async () => {
      return request(app.getHttpServer())
        .get('/stations/free/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Rents', () => {
    it('POST /rents', async () => {
      return request(app.getHttpServer())
        .post('/rents')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stallId, cardId })
        .expect('');
    });

    it('GET /rents', async () => {
      return request(app.getHttpServer())
        .get('/rents')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /rents/my', async () => {
      return request(app.getHttpServer())
        .get('/rents/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (rentId = res.body.result[0].id));
    });

    it('GET /rents/received', async () => {
      return request(app.getHttpServer())
        .get('/rents/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /rents/all', async () => {
      return request(app.getHttpServer())
        .get('/rents/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /rents/my/select', async () => {
      return request(app.getHttpServer())
        .get('/rents/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /rents/all/select', async () => {
      return request(app.getHttpServer())
        .get('/rents/all/select')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /goods/markets', async () => {
      return request(app.getHttpServer())
        .post('/goods/markets')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          rentId,
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('POST /goods/markets', async () => {
      return request(app.getHttpServer())
        .post('/goods/markets')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          rentId,
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('GET /rents/:rentId/things', async () => {
      return request(app.getHttpServer())
        .get(`/rents/${rentId}/things`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Leases', () => {
    it('POST /leases', async () => {
      return request(app.getHttpServer())
        .post('/leases')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cellId, cardId })
        .expect('');
    });

    it('GET /leases', async () => {
      return request(app.getHttpServer())
        .get('/leases')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /leases/my', async () => {
      return request(app.getHttpServer())
        .get('/leases/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (leaseId = res.body.result[0].id));
    });

    it('GET /leases/received', async () => {
      return request(app.getHttpServer())
        .get('/leases/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /leases/all', async () => {
      return request(app.getHttpServer())
        .get('/leases/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /leases/my/select', async () => {
      return request(app.getHttpServer())
        .get('/leases/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /leases/all/select', async () => {
      return request(app.getHttpServer())
        .get('/leases/all/select')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /goods/storages', async () => {
      return request(app.getHttpServer())
        .post('/goods/storages')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          leaseId,
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('POST /goods/storages', async () => {
      return request(app.getHttpServer())
        .post('/goods/storages')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          leaseId,
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('GET /leases/:leaseId/things', async () => {
      return request(app.getHttpServer())
        .get(`/leases/${leaseId}/things`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Shops Goods', () => {
    it('POST /goods/shops', async () => {
      return request(app.getHttpServer())
        .post('/goods/shops')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          shopId,
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('POST /goods/shops', async () => {
      return request(app.getHttpServer())
        .post('/goods/shops')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          shopId,
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('GET /goods', async () => {
      return request(app.getHttpServer())
        .get('/goods')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /goods/my', async () => {
      return request(app.getHttpServer())
        .get(`/goods/my?shop=${shopId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (shopGoodsId = res.body.result.map((g) => g.id)));
    });

    it('GET /goods/placed', async () => {
      return request(app.getHttpServer())
        .get('/goods/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /goods/all', async () => {
      return request(app.getHttpServer())
        .get('/goods/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /shops/:shopId/goods', async () => {
      return request(app.getHttpServer())
        .get(`/shops/${shopId}/goods`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /purchases', async () => {
      return request(app.getHttpServer())
        .post('/purchases')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          goodId: shopGoodsId[0],
          cardId,
          amount: 1,
          rate: 5,
          stationId,
          price: 10,
        })
        .expect('');
    });

    it('POST /purchases', async () => {
      return request(app.getHttpServer())
        .post('/purchases')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          goodId: shopGoodsId[0],
          cardId,
          amount: 1,
          rate: 5,
          stationId: 0,
          price: 0,
        })
        .expect('');
    });

    it('PATCH /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .patch(`/goods/${shopGoodsId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('PATCH /goods/:goodId/states', async () => {
      return request(app.getHttpServer())
        .patch(`/goods/${shopGoodsId[0]}/states`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ amount: 1, price: 10 })
        .expect('');
    });

    it('DELETE /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .delete(`/goods/${shopGoodsId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .post(`/goods/${shopGoodsId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /goods/:goodId/states', async () => {
      return request(app.getHttpServer())
        .get(`/goods/${shopGoodsId[0]}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Markets Goods', () => {
    it('GET /goods', async () => {
      return request(app.getHttpServer())
        .get('/goods')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /goods/my', async () => {
      return request(app.getHttpServer())
        .get(`/goods/my?market=${marketId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (marketGoodsId = res.body.result.map((g) => g.id)));
    });

    it('GET /goods/placed', async () => {
      return request(app.getHttpServer())
        .get('/goods/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /goods/all', async () => {
      return request(app.getHttpServer())
        .get('/goods/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /purchases', async () => {
      return request(app.getHttpServer())
        .post('/purchases')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          goodId: marketGoodsId[0],
          cardId,
          amount: 1,
          rate: 5,
          stationId,
          price: 10,
        })
        .expect('');
    });

    it('POST /purchases', async () => {
      return request(app.getHttpServer())
        .post('/purchases')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          goodId: marketGoodsId[0],
          cardId,
          amount: 1,
          rate: 5,
          stationId: 0,
          price: 0,
        })
        .expect('');
    });

    it('PATCH /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .patch(`/goods/${marketGoodsId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('PATCH /goods/:goodId/states', async () => {
      return request(app.getHttpServer())
        .patch(`/goods/${marketGoodsId[0]}/states`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ amount: 1, price: 10 })
        .expect('');
    });

    it('DELETE /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .delete(`/goods/${marketGoodsId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .post(`/goods/${marketGoodsId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /goods/:goodId/states', async () => {
      return request(app.getHttpServer())
        .get(`/goods/${marketGoodsId[0]}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /rents/:rentId/continue', async () => {
      return request(app.getHttpServer())
        .post(`/rents/${rentId}/continue`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /rents/:rentId', async () => {
      return request(app.getHttpServer())
        .post(`/rents/${rentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Storages Goods', () => {
    it('GET /goods', async () => {
      return request(app.getHttpServer())
        .get('/goods')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /goods/my', async () => {
      return request(app.getHttpServer())
        .get(`/goods/my?storage=${storageId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (storageGoodsId = res.body.result.map((g) => g.id)));
    });

    it('GET /goods/placed', async () => {
      return request(app.getHttpServer())
        .get('/goods/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /goods/all', async () => {
      return request(app.getHttpServer())
        .get('/goods/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /purchases', async () => {
      return request(app.getHttpServer())
        .post('/purchases')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          goodId: storageGoodsId[0],
          cardId,
          amount: 1,
          rate: 5,
          stationId,
          price: 10,
        })
        .expect('');
    });

    it('POST /purchases', async () => {
      return request(app.getHttpServer())
        .post('/purchases')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          goodId: storageGoodsId[0],
          cardId,
          amount: 1,
          rate: 5,
          stationId: 0,
          price: 0,
        })
        .expect('');
    });

    it('PATCH /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .patch(`/goods/${storageGoodsId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('PATCH /goods/:goodId/states', async () => {
      return request(app.getHttpServer())
        .patch(`/goods/${storageGoodsId[0]}/states`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ amount: 1, price: 10 })
        .expect('');
    });

    it('DELETE /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .delete(`/goods/${storageGoodsId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .post(`/goods/${storageGoodsId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /goods/:goodId/states', async () => {
      return request(app.getHttpServer())
        .get(`/goods/${storageGoodsId[0]}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /leases/:leaseId/continue', async () => {
      return request(app.getHttpServer())
        .post(`/leases/${leaseId}/continue`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /leases/:leaseId', async () => {
      return request(app.getHttpServer())
        .post(`/leases/${leaseId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Shops Purchases', () => {
    it('GET /purchases/my', async () => {
      return request(app.getHttpServer())
        .get(`/purchases/my?shop=${shopId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (shopsPurchasesId = res.body.result.map((b) => b.id)));
    });

    it('GET /purchases/sold', async () => {
      return request(app.getHttpServer())
        .get('/purchases/sold')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /purchases/all', async () => {
      return request(app.getHttpServer())
        .get('/purchases/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /purchases/my/select', async () => {
      return request(app.getHttpServer())
        .get('/purchases/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /purchases/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/purchases/${user.id}/select`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /goods/:goodId/purchases', async () => {
      return request(app.getHttpServer())
        .get(`/goods/${shopGoodsId[0]}/purchases`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Markets Purchases', () => {
    it('GET /purchases/my', async () => {
      return request(app.getHttpServer())
        .get(`/purchases/my?market=${marketId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (marketsPurchasesId = res.body.result.map((t) => t.id)));
    });

    it('GET /purchases/sold', async () => {
      return request(app.getHttpServer())
        .get('/purchases/sold')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /purchases/placed', async () => {
      return request(app.getHttpServer())
        .get('/purchases/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /purchases/all', async () => {
      return request(app.getHttpServer())
        .get('/purchases/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /purchases/my/select', async () => {
      return request(app.getHttpServer())
        .get('/purchases/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /purchases/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/purchases/${user.id}/select`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /goods/:goodId/purchases', async () => {
      return request(app.getHttpServer())
        .get(`/goods/${marketGoodsId[0]}/purchases`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Storages Purchases', () => {
    it('GET /purchases/my', async () => {
      return request(app.getHttpServer())
        .get(`/purchases/my?storage=${storageId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then(
          (res) => (storagesPurchasesId = res.body.result.map((s) => s.id)),
        );
    });

    it('GET /purchases/sold', async () => {
      return request(app.getHttpServer())
        .get('/purchases/sold')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /purchases/placed', async () => {
      return request(app.getHttpServer())
        .get('/purchases/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /purchases/all', async () => {
      return request(app.getHttpServer())
        .get('/purchases/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /purchases/my/select', async () => {
      return request(app.getHttpServer())
        .get('/purchases/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /purchases/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/purchases/${user.id}/select`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /goods/:goodId/purchases', async () => {
      return request(app.getHttpServer())
        .get(`/goods/${storageGoodsId[0]}/purchases`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Shops Deliveries', () => {
    it('POST /deliveries', async () => {
      return request(app.getHttpServer())
        .post('/deliveries')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ purchaseId: shopsPurchasesId[0], stationId, cardId, price: 10 })
        .expect('');
    });

    it('GET /deliveries', async () => {
      return request(app.getHttpServer())
        .get('/deliveries')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/my', async () => {
      return request(app.getHttpServer())
        .get(`/deliveries/my?shop=${shopId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (shopsDeliveriesId = res.body.result.map((d) => d.id)));
    });

    it('PATCH /deliveries/:deliveryId', async () => {
      return request(app.getHttpServer())
        .patch(`/deliveries/${shopsDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ price: 10 })
        .expect('');
    });

    it('POST /deliveries/:deliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${shopsDeliveriesId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /deliveries/taken', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/placed', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/all', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /deliveries/:deliveryId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${shopsDeliveriesId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /deliveries/:deliveryId', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${shopsDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /deliveries/:deliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${shopsDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /deliveries/:shopDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/deliveries/${shopsDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /deliveries/:deliveryId', async () => {
      return request(app.getHttpServer())
        .delete(`/deliveries/${shopsDeliveriesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /purchases/:purchaseId', async () => {
      return request(app.getHttpServer())
        .delete(`/purchases/${shopsPurchasesId[1]}`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect('');
    });
  });

  describe('Markets Deliveries', () => {
    it('POST /deliveries', async () => {
      return request(app.getHttpServer())
        .post('/deliveries')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          purchaseId: marketsPurchasesId[0],
          stationId,
          cardId,
          price: 10,
        })
        .expect('');
    });

    it('GET /deliveries', async () => {
      return request(app.getHttpServer())
        .get('/deliveries')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/my', async () => {
      return request(app.getHttpServer())
        .get(`/deliveries/my?market=${marketId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then(
          (res) => (marketsDeliveriesId = res.body.result.map((d) => d.id)),
        );
    });

    it('PATCH /deliveries/:deliveryId', async () => {
      return request(app.getHttpServer())
        .patch(`/deliveries/${marketsDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ price: 10 })
        .expect('');
    });

    it('POST /deliveries/:deliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${marketsDeliveriesId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /deliveries/taken', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/placed', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/all', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /deliveries/:deliveryId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${marketsDeliveriesId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /deliveries/:deliveryId', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${marketsDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /deliveries/:deliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${marketsDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /deliveries/:deliveryId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/deliveries/${marketsDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /deliveries/:deliveryId', async () => {
      return request(app.getHttpServer())
        .delete(`/deliveries/${marketsDeliveriesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /purchases/:purchaseId', async () => {
      return request(app.getHttpServer())
        .delete(`/purchases/${marketsPurchasesId[1]}`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect('');
    });
  });

  describe('Storages Deliveries', () => {
    it('POST /deliveries', async () => {
      return request(app.getHttpServer())
        .post('/deliveries')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          purchaseId: storagesPurchasesId[0],
          stationId,
          cardId,
          price: 10,
        })
        .expect('');
    });

    it('GET /deliveries', async () => {
      return request(app.getHttpServer())
        .get('/deliveries')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/my', async () => {
      return request(app.getHttpServer())
        .get(`/deliveries/my?storage=${storageId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then(
          (res) => (storagesDeliveriesId = res.body.result.map((d) => d.id)),
        );
    });

    it('PATCH /deliveries/:storageDeliveryId', async () => {
      return request(app.getHttpServer())
        .patch(`/deliveries/${storagesDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ price: 10 })
        .expect('');
    });

    it('POST /deliveries/:storageDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${storagesDeliveriesId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /deliveries/taken', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/placed', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/all', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /deliveries/:storageDeliveryId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${storagesDeliveriesId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /deliveries/:storageDeliveryId', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${storagesDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /deliveries/:storageDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${storagesDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /deliveries/:storageDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/deliveries/${storagesDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /deliveries/:storageDeliveryId', async () => {
      return request(app.getHttpServer())
        .delete(`/deliveries/${storagesDeliveriesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /purchases/:purchaseId', async () => {
      return request(app.getHttpServer())
        .delete(`/purchases/${storagesPurchasesId[1]}`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect('');
    });
  });

  describe('Orders', () => {
    it('POST /orders', async () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          stationId,
          cardId,
          item: Item.STONE,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('POST /orders', async () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          stationId,
          cardId,
          item: Item.STONE,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('GET /orders', async () => {
      return request(app.getHttpServer())
        .get('/orders')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /orders/my', async () => {
      return request(app.getHttpServer())
        .get('/orders/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (ordersId = res.body.result.map((o) => o.id)));
    });

    it('PATCH /orders/:orderId', async () => {
      return request(app.getHttpServer())
        .patch(`/orders/${ordersId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          item: Item.STONE,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('POST /orders/:orderId/take', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${ordersId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /orders/taken', async () => {
      return request(app.getHttpServer())
        .get('/orders/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /orders/placed', async () => {
      return request(app.getHttpServer())
        .get('/orders/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /orders/all', async () => {
      return request(app.getHttpServer())
        .get('/orders/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /orders/:orderId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${ordersId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /orders/:orderId', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${ordersId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /orders/:orderId/take', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${ordersId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /orders/:orderId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/orders/${ordersId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /orders/:orderId', async () => {
      return request(app.getHttpServer())
        .delete(`/orders/${ordersId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Haulages', () => {
    it('POST /haulages', async () => {
      return request(app.getHttpServer())
        .post('/haulages')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          fromStationId: stationId,
          toStationId: stationId,
          cardId,
          item: Item.STONE,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('POST /haulages', async () => {
      return request(app.getHttpServer())
        .post('/haulages')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          fromStationId: stationId,
          toStationId: stationId,
          cardId,
          item: Item.STONE,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('GET /haulages', async () => {
      return request(app.getHttpServer())
        .get('/haulages')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /haulages/my', async () => {
      return request(app.getHttpServer())
        .get('/haulages/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (haulagesId = res.body.result.map((d) => d.id)));
    });

    it('PATCH /haulages/:haulageId', async () => {
      return request(app.getHttpServer())
        .patch(`/haulages/${haulagesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          item: Item.STONE,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('POST /haulages/:haulageId/take', async () => {
      return request(app.getHttpServer())
        .post(`/haulages/${haulagesId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /haulages/taken', async () => {
      return request(app.getHttpServer())
        .get('/haulages/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /haulages/placed', async () => {
      return request(app.getHttpServer())
        .get('/haulages/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /haulages/all', async () => {
      return request(app.getHttpServer())
        .get('/haulages/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /haulages/:haulageId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/haulages/${haulagesId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /haulages/:haulageId', async () => {
      return request(app.getHttpServer())
        .post(`/haulages/${haulagesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /haulages/:haulageId/take', async () => {
      return request(app.getHttpServer())
        .post(`/haulages/${haulagesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /haulages/:haulageId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/haulages/${haulagesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /haulages/:haulageId', async () => {
      return request(app.getHttpServer())
        .delete(`/haulages/${haulagesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Hires', () => {
    it('POST /boxes', async () => {
      return request(app.getHttpServer())
        .post('/boxes')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /orders', async () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          stationId,
          cardId,
          item: Item.STONE,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('GET /hires', async () => {
      return request(app.getHttpServer())
        .get('/hires')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /hires/my', async () => {
      return request(app.getHttpServer())
        .get('/hires/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (hireId = res.body.result[0].id));
    });

    it('GET /hires/received', async () => {
      return request(app.getHttpServer())
        .get('/hires/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /hires/all', async () => {
      return request(app.getHttpServer())
        .get('/hires/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /hires/:hireId/continue', async () => {
      return request(app.getHttpServer())
        .post(`/hires/${hireId}/continue`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /hires/:hireId', async () => {
      return request(app.getHttpServer())
        .post(`/hires/${hireId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /hires/:hireId/things', async () => {
      return request(app.getHttpServer())
        .get(`/hires/${hireId}/things`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });
});
